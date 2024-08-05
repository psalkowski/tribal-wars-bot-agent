import 'reflect-metadata';
import { config as dotenv } from 'dotenv';
import { Agent } from './service/agent.js';
// import { setupTransmit } from './events/index.js';
import { setupErrorHandling } from './service/error.js';
import { wait } from './utils/wait.js';
import { Container } from 'typedi';
import { QueueManager } from './manager/queue.manager.js';
import moment from 'moment';
import Logger from './core/logger.js';
import { CaptchaAction } from './actions/captcha.action.js';

dotenv();

(async () => {
  setupErrorHandling();
  // setupTransmit();

  const queueManager = Container.get(QueueManager);
  const agent = Container.get(Agent);
  const logger = Logger.getLogger('Main');

  let lastCaptchaTime = -Infinity;

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    let hasCaptcha = false;

    logger.log('Start agent');
    await agent.start();

    await agent.stop();
    const nextRun = hasCaptcha ? 5000 : queueManager.getNextActionTime();

    logger.log('Next run at:', moment().add(nextRun, 'milliseconds').format('YYYY-MM-DD HH:mm:ss'));

    await wait(nextRun);
  }
})();
