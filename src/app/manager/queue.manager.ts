import { store } from '../store/store.js';
import moment from 'moment';
import { Service } from 'typedi';
import { random } from '../utils/random.js';
import { getStartedAt } from '../store/slices/agent.slice.js';
import { PlaceAction } from '../composite/place.action.js';
import { MarketAction } from '../composite/market.action.js';
import { ReportAction } from '../composite/report.action.js';
import { Action } from '../actions/action.js';

@Service()
export class QueueManager {
  private readonly nightStart = moment().set({ hour: 0, minute: 0 });
  private readonly nightEnd = moment().set({ hour: 5, minute: 0 });

  private readonly agentRunTimeInDay = 15 * 60 * 1000;
  private readonly agentRunTimeInNight = 15 * 60 * 1000;

  private readonly actions: Action[];

  constructor(
    private readonly placeAction: PlaceAction,
    private readonly marketAction: MarketAction,
    private readonly reportAction: ReportAction,
  ) {
    this.actions = [this.placeAction, this.marketAction, this.reportAction];
  }

  getNextActionTime(): number {
    const nextRun = Math.min(...this.actions.map((action) => action.getNextRun()));
    const minimumDelay = this.getMinimumDelay();

    if (nextRun < minimumDelay) {
      return minimumDelay;
    }

    return nextRun;
  }

  shouldCloseAgent(): boolean {
    const runTime = this.isNight() ? this.agentRunTimeInNight : this.agentRunTimeInDay;

    return moment().valueOf() - this.getAgentStartAt() > runTime;
  }

  getMinimumDelay(): number {
    if (this.isNight()) {
      return this.getWaitTimeDuringNight();
    }

    return this.getWaitTimeDuringDay();
  }

  private getAgentStartAt() {
    return getStartedAt(store.getState());
  }

  private isNight() {
    return moment().isBetween(this.nightStart, this.nightEnd);
  }

  private getWaitTimeDuringNight() {
    return random(60 * 60 * 1000, 90 * 60 * 1000);
  }

  private getWaitTimeDuringDay() {
    return random(30 * 60 * 1000, 60 * 60 * 1000);
  }
}
