import { Bot } from '../bot.js';
import { clearTimeouts } from '../utils/timeout.js';
import * as Configurations from '../../config/index.js';
import { Config } from '../constants/config.js';
import { store } from '../store/store.js';
import { getWorldId, isAgentEnabled, registerAgent } from '../store/slices/agent.slice.js';
import { Service } from 'typedi';
import { Browser } from '../core/browser.js';
import Logger from '../core/logger.js';

@Service()
export class Agent {
  logger = Logger.getLogger('Agent');
  working = false;

  constructor(public browser: Browser, public bot: Bot) {}

  async start() {
    if (this.working) {
      this.logger.info('Is working...');
      return;
    }

    await store.dispatch(registerAgent()).unwrap();

    if (!isAgentEnabled(store.getState())) {
      this.logger.info('Agent is not enabled');
      return;
    }

    const world = getWorldId(store.getState());
    const config: Config = Configurations[world as keyof typeof Configurations];
    const page = await this.browser.createPage();

    this.logger.log('Start agent.', { world });

    this.working = true;

    await this.bot.run({ ...config }, page);

    await this.stop();
  }

  async stop() {
    this.logger.log('Stop agent gracefully.');

    clearTimeouts();
    this.working = false;

    await this.browser.close();
  }
}
