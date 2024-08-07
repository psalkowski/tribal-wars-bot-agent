import { Page } from 'puppeteer';
import { Action } from '../action.js';
import { scrollIntoViewport } from '../../utils/scroll-into-viewport.js';

export class OpenFarmAssistanceAction extends Action {
  name = 'OpenFarmAssistanceAction';
  farmLinkSelector = '#manager_icon_farm';

  async handle(page: Page): Promise<Action> {
    await scrollIntoViewport(page, this.farmLinkSelector);
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
      page.click(this.farmLinkSelector),
    ]);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$(this.farmLinkSelector)) !== null;
  }
}
