import moment from 'moment';
import { dispatch, store } from '../store/store.js';
import { random } from '../utils/random.js';
import { Game } from '../game/game.js';
import { Coordinate } from '../models/coordinate.js';
import { IFarmCommand } from '../models/farm-command.js';
import { addFarmCommand, fetchFarmCommands } from '../store/slices/farm-commands.slice.js';
import { IArmy } from '../models/army.js';
import { Container, Service } from 'typedi';

@Service()
export class FarmManager {
  commands: { [key: string]: number } = {};

  async load() {
    const commands: IFarmCommand[] = await dispatch(fetchFarmCommands()).unwrap();

    this.commands = (commands || [])
      .map((command: IFarmCommand) => {
        const coordinate = new Coordinate(command.targetX, command.targetY);

        return {
          [coordinate.toString()]: command.arriveAt,
        };
      })
      .reduce((a, b) => ({ ...a, ...b }), {});
  }

  canFarm(coordinate: string, duration: number): boolean {
    const game = Container.get(Game);

    if (['580|660'].includes(coordinate)) {
      return false;
    }

    if (!game.isAllowedToFarm(coordinate)) {
      return false;
    }

    if (!this.commands[coordinate]) {
      return true;
    }

    const arriveAt = moment().add(duration, 'milliseconds').subtract(random(20, 30), 'minutes').valueOf();

    return this.commands[coordinate] < arriveAt;
  }

  // no need to wait for promise
  create(source: Coordinate, target: Coordinate, duration: number, army: IArmy) {
    const arriveAt = moment().add(duration, 'milliseconds');
    const returnAt = moment().add(duration * 2, 'milliseconds');

    this.commands[target.toString()] = arriveAt.valueOf();

    store.dispatch(
      addFarmCommand({
        sourceX: source.x,
        sourceY: source.y,
        targetX: target.x,
        targetY: target.y,
        duration,
        arriveAt: arriveAt.valueOf(),
        returnAt: returnAt.valueOf(),
        ...army,
      }),
    );
  }
}
