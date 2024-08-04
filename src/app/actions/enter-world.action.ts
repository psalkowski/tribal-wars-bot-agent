import { Page } from 'puppeteer';
import { Action } from './action.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { Ui } from '../constants/ui.js';
import { Container } from 'typedi';
import Navigation from '../core/navigation.js';

export class EnterWorldAction extends Action {
  name = 'EnterWorldAction';

  async handle(page: Page): Promise<Action> {
    const navigation = Container.get(Navigation);

    await navigation.goToUrl(`https://plemiona.pl/page/play/__world__`);
    await page.waitForSelector('#ds_body');

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$('.login .world_button_active')) !== null;
  }
}
