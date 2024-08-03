import { Page } from 'puppeteer';

export abstract class Action {
  name = 'Not set';
  runAt = 0;

  abstract handle(page: Page): Promise<Action>;
  abstract isSupported(page: Page): Promise<boolean>;

  constructor(runAt = 0) {
    this.runAt = runAt;
  }
}
