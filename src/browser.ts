/**
 * Import main entrypoint
 */
import 'reflect-metadata';
import { config as dotenv } from 'dotenv';
import { store } from './app/store/store.js';
import { setAgent } from './app/store/slices/agent.slice.js';
import { wait } from './app/utils/wait.js';
import { Browser } from './app/core/browser.js';

dotenv();

process.env.HEADLESS = 'false';

(async () => {
  store.dispatch(setAgent({ worldId: process.env.WORLD as string, enabled: true }));

  const browser = new Browser();
  await browser.createPage();

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    await wait(60000);
  }
})();
