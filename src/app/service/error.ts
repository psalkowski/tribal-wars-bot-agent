import { log } from '../logger/logger.js';
import { wait } from '../utils/wait.js';
import { Container } from 'typedi';
import { Agent } from './agent.js';
import moment from 'moment';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export const setupErrorHandling = () => {
  let lastErrorTime = moment().valueOf();

  const handleError = async (reason: string) => {
    const agent = Container.get(Agent);

    const now = moment().valueOf();

    log('Unhandled error:', reason);

    const prefix = moment().format('YYYYMMDD_HHmmss');

    if (!existsSync('./storage/reports/')) {
      mkdirSync('./storage/reports/', { recursive: true });
    }

    const page = await agent.browser.getPage();
    await page.screenshot({
      path: `./storage/reports/${prefix}_error.png`,
      fullPage: true,
    });

    writeFileSync(`./storage/reports/${prefix}_error.html`, await page.content());
    writeFileSync(`./storage/reports/${prefix}_error.log`, reason);

    await agent.stop();
    await wait(3000);

    // if errors occurs often than each 60 sec, abort
    if (now - lastErrorTime < 60000) {
      do {
        log('Error occurs often than once per minute. Going into sleep mode.');
        await wait(300000);
      } while (true);
    }

    lastErrorTime = now;
    await agent.start();
  };

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
