import { Action } from './action.js';
import { Page } from 'puppeteer';
import { getQueryParams } from '../utils/query.js';
import { ScreenType } from '../constants/screen.js';
import { CheckAction } from '../composite/check.action.js';
import { Ui } from '../constants/ui.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { TribalWarsUrls } from '../constants/urls.js';

export class OpenOverviewAction extends Action {
  name = 'OpenOverviewAction';
  selector = Ui.Menu.overview;
  check = new CheckAction();

  async handle(page: Page): Promise<Action> {
    try {
      await page.goto(
        parseTribalWarsUrl(parseTribalWarsUrl(TribalWarsUrls.overview)),
      );
    } catch (e) {
      await this.check.handle(page);
      await this.handle(page);
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const query = getQueryParams(page.url());

    // we are already on this page
    if ([ScreenType.OVERVIEW, ScreenType.WELCOME].includes(query.screen)) {
      return false;
    }

    return (await page.$(this.selector)) !== null;
  }
}
