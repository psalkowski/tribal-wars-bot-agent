import { config as dotenv } from 'dotenv';
import { Agent } from './service/agent.js';
import { setupErrorHandling } from './service/error.js';
import { wait, waitLikeHuman } from './utils/wait.js';
import { Container } from 'typedi';
import { QueueManager } from './manager/queue.manager.js';
import moment from 'moment';
import Logger from './core/logger.js';

dotenv();

(async () => {
  setupErrorHandling();

  const queueManager = Container.get(QueueManager);
  const agent = Container.get(Agent);
  const logger = Logger.getLogger('Main');

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    await agent.start();
    await waitLikeHuman();
    await agent.stop();

    const nextRun = queueManager.getNextActionTime();

    logger.log('Next run at:', moment().add(nextRun, 'milliseconds').format('YYYY-MM-DD HH:mm:ss'));

    await wait(nextRun);
  }
})();
