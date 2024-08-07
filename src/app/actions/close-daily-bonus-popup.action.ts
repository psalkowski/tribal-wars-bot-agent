import { Action } from './action.js';
import { Page } from 'puppeteer';
import { Ui } from '../constants/ui.js';
import { waitLikeHuman } from '../utils/wait.js';
import { Service } from 'typedi';

@Service()
export class CloseDailyBonusPopupAction extends Action {
  name = 'CloseDailyBonusPopupAction';

  async handle(page: Page): Promise<Action> {
    const openList = await page.$$(Ui.Popup.dailyBonusOpen);
    for (const element of openList) {
      await element.click();
    }

    await waitLikeHuman();

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
