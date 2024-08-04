import { Page } from 'puppeteer';
import { Action } from './action.js';
import { getWorldId } from '../store/slices/agent.slice.js';
import { store } from '../store/store.js';
import { wait } from '../utils/wait.js';

export class LoginAction extends Action {
  name = 'LoginAction';

  async handle(page: Page): Promise<Action> {
    await page.type('#user', `${process.env.ACCOUNT_USERNAME}`);
    await page.type('#password', `${process.env.ACCOUNT_PASSWORD}`);
    await page.click('#remember-me');
    await page.click('.btn-login');

    try {
      await page.waitForSelector('a[href="/page/logout"]');
    } catch (e) {
      await page.solveRecaptchas();
      await page.waitForSelector('a[href="/page/logout"]');
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$('#user')) !== null;
  }
}
