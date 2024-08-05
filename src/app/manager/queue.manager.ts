import { store } from '../store/store.js';
import { getFarmCommands } from '../store/slices/farm-commands.slice.js';
import moment from 'moment';
import { Service } from 'typedi';
import { random } from '../utils/random.js';
import { getStartedAt } from '../store/slices/agent.slice.js';

@Service()
export class QueueManager {
  private readonly nightStart = moment().set({ hour: 0, minute: 0 });
  private readonly nightEnd = moment().set({ hour: 5, minute: 0 });

  private readonly agentRunTimeInDay = 120 * 60 * 1000;
  private readonly agentRunTimeInNight = 60 * 60 * 1000;

  getNextActionTime(): number {
    const nextRun = this.getNextFarmTime();
    const delayBetweenRuns = this.getSafeTimeOffset();

    if (nextRun < delayBetweenRuns) {
      return delayBetweenRuns;
    }

    return nextRun;
  }

  shouldCloseAgent(): boolean {
    const runTime = this.isNight() ? this.agentRunTimeInNight : this.agentRunTimeInDay;

    return moment().valueOf() - this.getAgentStartAt() > runTime;
  }

  getSafeTimeOffset(): number {
    if (this.shouldCloseAgent()) {
      return this.isNight() ? this.getWaitTimeDuringNight() : this.getWaitTimeDuringDay();
    }

    // when agent finished run, add extra 30 and 90 sec before run next action
    return random(30000, 90000);
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

  private getAgentStartAt() {
    return getStartedAt(store.getState());
  }

  private isNight() {
    return moment().isBetween(this.nightStart, this.nightEnd);
  }

  private getWaitTimeDuringNight() {
    return random(50 * 60 * 1000, 80 * 60 * 1000);
  }

  private getWaitTimeDuringDay() {
    return random(20 * 60 * 1000, 40 * 60 * 1000);
  }
}
