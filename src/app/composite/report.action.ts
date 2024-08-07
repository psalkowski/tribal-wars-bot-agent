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
import { ReadReportsAction } from '../actions/report/read-reports.action.js';

@Service()
export class ReportAction extends CompositeAction {
  name = 'ReportAction';

  constructor(private readonly readReportsAction: ReadReportsAction) {
    super();

    this.actions = [this.readReportsAction];
  }

  async handle(page: Page): Promise<Action> {
    await super.handle(page);

    this.nextRunAt = moment().add(30, 'minutes').valueOf();

    return null;
  }

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }
}
