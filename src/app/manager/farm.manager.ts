import moment from 'moment';
import { store } from '../store/store.js';
import { random } from '../utils/random.js';
import { Game } from '../game/game.js';
import { Coordinate } from '../models/coordinate.js';
import { addFarmCommand, getFarmMapByCoordinates } from '../store/slices/farm-commands.slice.js';
import { IArmy } from '../models/army.js';
import { Service } from 'typedi';

@Service()
export class FarmManager {
  constructor(private readonly game: Game) {}

  canFarm(coordinate: string, duration: number): boolean {
    if (!this.game.isAllowedToFarm(coordinate)) {
      return false;
    }

    const commands = getFarmMapByCoordinates(store.getState());

    if (!commands[coordinate]) {
      return true;
    }

    const arriveAt = moment().add(duration, 'milliseconds').subtract(random(20, 30), 'minutes').valueOf();

    return commands[coordinate].arriveAt < arriveAt;
  }

  // no need to wait for promise
  create(source: Coordinate, target: Coordinate, duration: number, army: IArmy) {
    const arriveAt = moment().add(duration, 'milliseconds');
    const returnAt = moment().add(duration * 2, 'milliseconds');

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
