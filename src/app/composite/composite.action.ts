import { Action } from '../actions/action.js';
import { Page } from 'puppeteer';
import { wait } from '../utils/wait.js';
import Logger from '../core/logger.js';

export abstract class CompositeAction extends Action {
  protected readonly logger = Logger.getLogger('CompositeAction');
  name = 'CompositeAction';
  actions: Action[] = [];

  getTimeout(): number {
    return 0;
  }

  async handle(page: Page): Promise<Action> {
    for (const action of this.actions) {
      let next: any = action;

      do {
        const isSupported = await next?.isSupported(page);
        if (!isSupported) {
          break;
        }

        await this.wait();
      } while ((next = await next?.handle(page)));
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const supported = await Promise.all(this.actions.map(async (action) => await action.isSupported(page)));

    return supported.includes(true);
  }

  async wait(): Promise<void> {
    const timeout = this.getTimeout();

    if (timeout) {
      this.logger.log('Wait', timeout);
      await wait(timeout);
    }
  }
}
