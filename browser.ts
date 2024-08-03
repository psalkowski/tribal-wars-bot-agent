/**
 * Import main entrypoint
 */
import { config as dotenv } from "dotenv";
import store from "./src/store";
import { setAgent } from "./src/store/slices/agent.slice";
import { BrowserInstance } from "./src/service/browser";
import { wait } from "./src/utils/wait";

dotenv();

process.env.HEADLESS = "false";

(async () => {
  store.dispatch(setAgent({ worldId: process.env.WORLD, enabled: true }));

  await BrowserInstance.start();

  while (true) {
    await wait(60000);
  }
})();
