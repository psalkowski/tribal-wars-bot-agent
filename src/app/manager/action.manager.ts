import { SetupAction } from '../composite/setup.action.js';
import { Page } from 'puppeteer';
import { waitLikeHuman } from '../utils/wait.js';
import { Service } from 'typedi';
import Navigation from '../core/navigation.js';
import { ScreenType } from '../constants/screen.js';
import Logger from '../core/logger.js';
import { MarketAction } from '../composite/market.action.js';
import { PlaceAction } from '../composite/place.action.js';
import { ReportAction } from '../composite/report.action.js';
import { Action } from '../actions/action.js';
import { shuffle } from 'lodash-es';
import moment from 'moment';

@Service()
export class ActionManager {
  private readonly logger = Logger.getLogger('ActionManager');

  actions: Action[];

  constructor(
    private readonly setup: SetupAction,
    private readonly navigation: Navigation,

    private readonly placeAction: PlaceAction,
    private readonly marketAction: MarketAction,
    private readonly reportAction: ReportAction,
  ) {
    this.actions = shuffle([this.placeAction, this.reportAction]);
  }

  async run(page: Page): Promise<void> {
    this.logger.log('Action Manager started.');

    await this.setup.handle(page);
    await this.navigation.goToScreen(ScreenType.OVERVIEW);

    await waitLikeHuman();

    const actions = shuffle(this.actions.filter((action) => action.nextRunAt < moment().valueOf()));

    for (const action of actions) {
      if (await action.isSupported(page)) {
        await action.handle(page);
      }
    }

    this.logger.log('Action Manager finished.');
  }
}
