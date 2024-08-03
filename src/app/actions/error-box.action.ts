import { Action } from './action.js';
import { Page } from 'puppeteer';

export class ErrorBoxAction extends Action {
  async handle(page: Page): Promise<Action | null> {
    await page.reload();

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$('.autoHideBox.error')) !== null;
  }
}
