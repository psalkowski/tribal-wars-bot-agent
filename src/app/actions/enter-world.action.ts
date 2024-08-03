import { Page } from 'puppeteer';
import { Action } from './action.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { Ui } from '../constants/ui.js';

export class EnterWorldAction extends Action {
  name = 'EnterWorldAction';

  async handle(page: Page): Promise<Action> {
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),

      page.click(parseTribalWarsUrl(Ui.Homepage.selectWorld)),
    ]);

    await page.waitForSelector('#ds_body');

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$('.login .world_button_active')) !== null;
  }
}
