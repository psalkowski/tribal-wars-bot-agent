import { Bot } from '../bot.js';
import { clearTimeouts } from '../utils/timeout.js';
import * as Configurations from '../../config/index.js';
import { Config } from '../constants/config.js';
import { dispatch, store } from '../store/store.js';
import { fetchAgent, getWorldId, isAgentEnabled, registerAgent, stopAgent } from '../store/slices/agent.slice.js';
import { Service } from 'typedi';
import { Browser } from '../core/browser.js';
import Logger from '../core/logger.js';
import { Page } from 'puppeteer';
import { CaptchaAction } from '../actions/captcha.action.js';
import { wait, waitLikeHuman } from '../utils/wait.js';
import moment from 'moment';

@Service()
export class Agent {
  logger = Logger.getLogger('Agent');
  working = false;
  captcha: CaptchaAction;
  lastCaptcha = -Infinity;

  constructor(public browser: Browser, public bot: Bot) {
    this.captcha = new CaptchaAction();
  }

  async start() {
    await store.dispatch(registerAgent()).unwrap();

    if (!isAgentEnabled(store.getState())) {
      this.logger.info('Agent is not enabled');
      return;
    }

    this.working = true;

    const world = getWorldId(store.getState());
    const config: Config = Configurations[world as keyof typeof Configurations];
    const page = await this.browser.createPage();

    this.logger.log('Start agent.', { world });
    await this.runBot(page, config);
  }

  async runBot(page: Page, config: Config): Promise<void> {
    try {
      await this.bot.run({ ...config }, page);
    } catch (e) {
      this.logger.error('Bot found an exception. Trying to solve captcha.');
      await wait(5000);

      if (await this.captcha.isSupported(page)) {
        this.logger.log('CaptchaAction found a captcha.');
        const now = moment().valueOf();

        // if captcha often than 60 seconds, rethrow
        if (now - this.lastCaptcha < 60000) {
          this.logger.log('Captcha has been found too often. Skip handling captcha.');
          throw e;
        }

        await this.captcha.handle(page);
        await waitLikeHuman();

        this.lastCaptcha = now;

        await Promise.all([
          page.waitForNavigation({
            waitUntil: 'networkidle0',
          }),
          page.reload(),
        ]);

        return this.runBot(page, config);
      }

      throw e;
    }
  }

  async stop() {
    this.logger.log('Stop agent gracefully.');

    await dispatch(stopAgent()).unwrap();

    clearTimeouts();
    this.working = false;

    await this.browser.close();
    this.browser = null;
  }
}
