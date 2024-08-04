import { Action } from './action.js';
import { Page } from 'puppeteer';
import { getQueryParams } from '../utils/query.js';
import { ScreenType } from '../constants/screen.js';
import { CheckAction } from '../composite/check.action.js';
import { Ui } from '../constants/ui.js';
import { Container } from 'typedi';
import Navigation from '../core/navigation.js';

export class OpenOverviewAction extends Action {
  name = 'OpenOverviewAction';
  selector = Ui.Menu.overview;
  check = new CheckAction();

  async handle(page: Page): Promise<Action> {
    const navigation = Container.get(Navigation);

    try {
      await navigation.goToScreen(ScreenType.OVERVIEW);
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
