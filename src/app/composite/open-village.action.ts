import { CompositeAction } from './composite.action.js';
import { OpenOverviewsVillagesAction } from '../actions/open-overviews-villages.action.js';
import { Page } from 'puppeteer';
import { Action } from '../actions/action.js';
import { log } from '../logger/logger.js';
import { scrollIntoViewport } from '../utils/scroll-into-viewport.js';
import { getPlayerVillageCount } from '../store/slices/player.slice.js';
import { store } from '../store/store.js';

export class OpenVillageAction extends CompositeAction {
  actions = [new OpenOverviewsVillagesAction()];
  villageId: number;

  constructor(villageId: number) {
    super();

    this.villageId = villageId;
  }

  async handle(page: Page): Promise<Action> {
    await super.handle(page);

    const selector = `span[data-id="${this.villageId}"] a`;

    log(`[${this.name}] Open village ${this.villageId}`);
    await page.waitForSelector(selector);
    await scrollIntoViewport(page, selector);
    await page.click(selector);
    await page.waitForSelector('#show_summary');

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const villages = getPlayerVillageCount(store.getState());

    return villages > 1;
  }
}
