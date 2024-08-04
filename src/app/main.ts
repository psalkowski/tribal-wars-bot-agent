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
import { writeFileSync, mkdirSync, existsSync } from 'fs';

dotenv();

(async () => {
  setupErrorHandling();
  // setupTransmit();

  const queueManager = Container.get(QueueManager);
  const agent = Container.get(Agent);
  const logger = Logger.getLogger('Main');

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    let hasCaptcha = false;

    logger.log('Start agent');

    try {
      await agent.start();
    } catch (e) {
      logger.error('Error occurs');
      logger.error(e);

      const captcha = new CaptchaAction();
      const page = await agent.browser.getPage();

      if (await captcha.isSupported(page)) {
        hasCaptcha = true;
        await captcha.handle(page);
      } else {
        const prefix = moment().format('YYYYMMDD_HHmmss');

        if (!existsSync('./storage/reports/')) {
          mkdirSync('./storage/reports/', { recursive: true });
        }

        await page.screenshot({
          path: `./storage/reports/${prefix}_fails.png`,
          fullPage: true,
        });

        writeFileSync(`./storage/reports/${prefix}_fails.html`, await page.content());

        await agent.stop();

        throw e;
      }
    }

    await agent.stop();
    const nextRun = hasCaptcha ? 5000 : queueManager.getNextActionTime();

    logger.log('Next run at:', moment().add(nextRun, 'milliseconds').format('YYYY-MM-DD HH:mm:ss'));

    await wait(nextRun);
  }
})();
