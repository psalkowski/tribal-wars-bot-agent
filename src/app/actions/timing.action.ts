import { Action } from './action.js';
import { Page } from 'puppeteer';
import { TimingInstance } from '../game/timing.js';

export class TimingAction extends Action {
  name = 'TimingAction';

  async handle(page: Page): Promise<Action> {
    await page.waitForFunction(() => 'Timing' in window);
    const timing = await page.evaluate(() => {
      return {
        timing: (window as any).Timing,
        performanceNow: performance.now(),
        currentServerTime: (window as any).Timing.getCurrentServerTime(),
      };
    });

    await TimingInstance.init(page, timing);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }
}
