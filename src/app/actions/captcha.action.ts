import { Action } from './action.js';
import { Page } from 'puppeteer';
import { wait } from '../utils/wait.js';
import { NoopAction } from './noop.action.js';
import Logger from '../core/logger.js';

export class CaptchaAction extends Action {
  logger = Logger.getLogger('CaptchaAction');
  name = 'CaptchaAction';

  async handle(page: Page): Promise<Action> {
    const { solved, solutions, captchas, error } = await page.solveRecaptchas();

    if (error) {
      this.logger.log('Recaptcha Error:', { solved, solutions, captchas, error });
    }

    if (solved.length || solutions.length || captchas.length) {
      this.logger.log('Recaptcha Solved:', { solved, solutions, captchas, error });
      // make sure that captcha has been filled
      await wait(5000);
    }

    return new NoopAction();
  }

  async isSupported(page: Page): Promise<boolean> {
    return (
      (await page.$('#bot_check')) !== null ||
      (await page.$('.g-recaptcha')) !== null ||
      (await page.$('[data-bot-protect="forced"]')) !== null ||
      (await page.$('#captcha')) !== null ||
      (await page.$('.h-captcha')) !== null
    );
  }
}
