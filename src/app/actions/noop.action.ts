import { Page } from 'puppeteer';
import { Action } from './action.js';

export class NoopAction extends Action {
  name = 'NoopAction';

  async handle(_: Page): Promise<Action> {
    return Promise.resolve(null);
  }

  async isSupported(_: Page): Promise<boolean> {
    return false;
  }
}
