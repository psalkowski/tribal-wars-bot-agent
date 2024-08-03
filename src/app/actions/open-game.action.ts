import { Page } from 'puppeteer';
import { Action } from './action.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { TribalWarsUrls } from '../constants/urls.js';

export class OpenGameAction extends Action {
  name = 'OpenGameAction';

  async handle(page: Page): Promise<Action> {
    await page.goto(parseTribalWarsUrl(TribalWarsUrls.open_game));

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const url = page.url();

    return url.includes('chrome:') || url.includes('about:blank');
  }
}
