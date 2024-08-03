import { store } from '../store/store.js';
import { getFarmCommands } from '../store/slices/farm-commands.slice.js';
import moment from 'moment';
import { Service } from 'typedi';
import { random } from '../utils/random.js';

@Service()
export class QueueManager {
  getNextActionTime(): number {
    const nextRun = this.getNextFarmTime();
    const delayBetweenRuns = this.getSafeTimeOffset();
    // const delayBetweenRuns = 0;

    if (nextRun < delayBetweenRuns) {
      return delayBetweenRuns;
    }

    return nextRun;
  }

  getSafeTimeOffset(): number {
    const nightStart = moment().set({ hour: 0, minute: 0 });
    const nightEnd = moment().set({ hour: 5, minute: 0 });

    if (moment().isBetween(nightStart, nightEnd)) {
      // between 60 and 90 minutes
      return random(60 * 60 * 1000, 90 * 60 * 1000);
    }

    // between 20 and 40 minutes
    return random(20 * 60 * 1000, 40 * 60 * 1000);
  }

  getNextFarmTime() {
    const farmCommands = getFarmCommands(store.getState());
    const now = moment().valueOf();

    const sortedCommands = farmCommands
      .filter((command) => command.returnAt > now)
      .sort((prev, next) => prev.returnAt - next.returnAt);

    if (!sortedCommands.length) {
      return 0;
    }

    const firstReturnAt = sortedCommands[0].returnAt;
    const lastElement = sortedCommands.filter((command) => command.returnAt - firstReturnAt < 60000).pop();

    return lastElement.returnAt - now;
  }
}
