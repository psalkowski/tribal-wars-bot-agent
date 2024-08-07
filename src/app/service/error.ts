import { wait } from '../utils/wait.js';
import { Container } from 'typedi';
import { Agent } from './agent.js';
import moment from 'moment';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { getAppDir } from '../utils/directory.js';
import Logger from '../core/logger.js';

const logger = Logger.getLogger('ErrorHandler');

export const setupErrorHandling = () => {
  let lastErrorTime = moment().valueOf();

  const handleError = async (reason: string) => {
    const agent = Container.get(Agent);
    const now = moment().valueOf();

    logger.error('Unhandled error:', reason);

    const fileNamePrefix = moment().format('YYYYMMDD_HHmmss');
    const dirNamePrefix = moment().format('YYYYMMDD');
    const dir = `./storage/reports/${dirNamePrefix}`;

    if (!existsSync(getAppDir(dir))) {
      mkdirSync(getAppDir(dir), { recursive: true });
    }

    const page = await agent.browser?.getPage();

    if (page) {
      await page.screenshot({
        path: getAppDir(`${dir}/${fileNamePrefix}_error.png`),
        fullPage: true,
      });

      writeFileSync(getAppDir(`${dir}/${fileNamePrefix}_error.html`), await page.content());
    }

    writeFileSync(getAppDir(`${dir}/${fileNamePrefix}_error.log`), reason.toString());

    await agent.stop();
    await wait(3000);

    // if errors occurs often than each 60 sec, abort
    if (now - lastErrorTime < 60000) {
      do {
        logger.warn('Error occurs often than once per minute. Going into sleep mode.');
        await wait(300000);
      } while (true);
    }

    lastErrorTime = now;
    await agent.start();
  };

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
