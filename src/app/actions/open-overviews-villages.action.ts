import { Action } from './action.js';
import { Page } from 'puppeteer';
import { scrollIntoViewport } from '../utils/scroll-into-viewport.js';
import { getPlayerVillageCount } from '../store/slices/player.slice.js';
import { store } from '../store/store.js';

export class OpenOverviewsVillagesAction extends Action {
  name = 'OpenOverviewsVillagesAction';
  selector = '#topContainer #menu_row > td:nth-child(2) > a';

  async handle(page: Page): Promise<Action> {
    await page.waitForSelector(this.selector);
    await scrollIntoViewport(page, this.selector);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
      page.click(this.selector),
    ]);

    if (await page.$('a.group-menu-item[data-group-type="all"]')) {
      await Promise.all([
        page.waitForNavigation({
          waitUntil: 'domcontentloaded',
        }),
        page.click('a.group-menu-item[data-group-type="all"]'),
      ]);
    }

    await page.waitForSelector('#overview_menu');

    if ((await page.$('#combined_table')) === null) {
      await Promise.all([
        page.waitForNavigation({
          waitUntil: 'domcontentloaded',
        }),
        page.click('#overview_menu a[href$="mode=combined"]'),
      ]);

      await page.waitForSelector('#combined_table');
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const villages = getPlayerVillageCount(store.getState());

    return (await page.$(this.selector)) !== null && villages > 1;
  }
}
