import { Page } from 'puppeteer';

export abstract class Action {
  name = 'Not set';
  nextRunAt = 0;
  lastRunAt = 0;

  abstract handle(page: Page): Promise<Action>;
  abstract isSupported(page: Page): Promise<boolean>;

  constructor(nextRunAt = 0) {
    this.nextRunAt = nextRunAt;
  }

  getLastRun() {
    return this.lastRunAt;
  }

  getNextRun() {
    return this.nextRunAt;
  }
}
