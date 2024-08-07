import { Action } from '../actions/action.js';

import { CompositeAction } from './composite.action.js';
import { random } from '../utils/random.js';
import { HUMAN_REACTION_MAX_MS, HUMAN_REACTION_MIN_MS } from '../constants/human.js';
import { Service } from 'typedi';
import { GetArmyDataAction } from '../actions/get-army-data.action.js';
import { getFarmCommands } from '../store/slices/farm-commands.slice.js';
import { store } from '../store/store.js';
import moment from 'moment/moment.js';
import { sortBy, SortDirection } from '../utils/array.js';
import { Page } from 'puppeteer';
import { FarmFromPlaceAction } from '../actions/farm-from-place.action.js';

@Service()
export class PlaceAction extends CompositeAction {
  name = 'PlaceAction';

  constructor(
    private readonly farmFromPlaceAction: FarmFromPlaceAction,
    private readonly armyDataAction: GetArmyDataAction,
  ) {
    super();

    this.actions = [this.armyDataAction, this.farmFromPlaceAction];
  }

  async handle(page: Page): Promise<Action> {
    await super.handle(page);

    this.nextRunAt = this.calculateNextRun();

    return null;
  }

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }

  calculateNextRun() {
    const farmCommands = getFarmCommands(store.getState());
    const now = moment().valueOf();

    const sortedCommands = farmCommands
      .filter((command) => command.returnAt > now)
      .sort(sortBy('arriveAt', SortDirection.ASC));

    if (!sortedCommands.length) {
      return 0;
    }

    const firstReturnAt = sortedCommands[0].returnAt;
    const lastElement = sortedCommands.filter((command) => command.returnAt - firstReturnAt < 60000).pop();

    return lastElement.returnAt - now;
  }
}
