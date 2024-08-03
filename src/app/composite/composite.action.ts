import { Action } from '../actions/action.js';
import { Page } from 'puppeteer';
import { wait } from '../utils/wait.js';
import { log } from '../logger/logger.js';

export abstract class CompositeAction extends Action {
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
        log(`[${next.name}] handle.`);
      } while ((next = await next?.handle(page)));
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const supported = await Promise.all(
      this.actions.map(async (action) => await action.isSupported(page)),
    );

    return supported.includes(true);
  }

  async wait(): Promise<void> {
    const timeout = this.getTimeout();

    log('Wait', timeout);

    if (timeout) {
      await wait(timeout);
    }
  }
}
