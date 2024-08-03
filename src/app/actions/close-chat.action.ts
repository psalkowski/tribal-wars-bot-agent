import { Action } from './action.js';
import { Page } from 'puppeteer';
import { NoopAction } from './noop.action.js';

export class CloseChatAction extends Action {
  name = 'CloseChatAction';

  async handle(page: Page): Promise<Action> {
    const chats = await page.$$('.chat-conversation .chat-button-close');

    for (const chat of chats) {
      await Promise.all([
        page.waitForNavigation({
          waitUntil: 'domcontentloaded',
        }),
        chat.click(),
      ]);
    }

    return new NoopAction();
  }

  async isSupported(page: Page): Promise<boolean> {
    const chats = await page.$$('.chat-conversation .chat-button-close');

    return chats.length > 0;
  }
}
