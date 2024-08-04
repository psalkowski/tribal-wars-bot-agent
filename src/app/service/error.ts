import { error, log } from '../logger/logger.js';
import { wait } from '../utils/wait.js';
import { Container } from 'typedi';
import { Agent } from './agent.js';
import moment from 'moment';

export const setupErrorHandling = () => {
  let lastErrorTime = moment().valueOf();

  const handleError = async (reason: string) => {
    const agent = Container.get(Agent);
    const now = moment().valueOf();

    log('Unhandled error:', reason);

    await agent.stop();
    await wait(3000);

    // if errors occurs often than each 60 sec, abort
    if (now - lastErrorTime < 60000) {
      log('Error occurs often than once per minute. Killing process.');
      process.exit(6);
    }

    lastErrorTime = now;
    await agent.start();
  };

  process.on('unhandledRejection', handleError);
  process.on('uncaughtException', handleError);
};
