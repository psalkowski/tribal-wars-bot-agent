import { Action } from './action.js';
import { Page } from 'puppeteer';
import { Ui } from '../constants/ui.js';

export class CloseDailyBonusPopupAction extends Action {
  name = 'CloseDailyBonusPopupAction';

  async handle(page: Page): Promise<Action> {
    const elements = await page.$$(Ui.Popup.dailyBonusClose);

    for (const element of elements) {
      await element.click();
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const chats = await page.$$(Ui.Popup.dailyBonusClose);

    return chats.length > 0;
  }
}
