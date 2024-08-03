import { Action } from './action.js';
import { Page } from 'puppeteer';
import moment from 'moment';

export class IncomingAttackAction extends Action {
  selector: '#commands_incomings';

  async handle(page: Page): Promise<Action> {
    const table = await page.$(this.selector);
    const rows = Array.from(await table.$$('.command-row'));

    const incomings = rows.map(async (row) => {
      const id = (await row.$('[data-id]')).getProperty('data-id');
      const endTime = (await row.$('[data-endtime]')).getProperty(
        'data-endtime',
      );
      const now = moment().valueOf();
    });

    return Promise.resolve(undefined);
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$(this.selector)) !== null;
  }
}
