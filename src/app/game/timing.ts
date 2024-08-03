import { performance as perf } from 'perf_hooks';
import { Page } from 'puppeteer';
import { Service } from 'typedi';

@Service()
class Timing {
  serverTime: number;
  offsetFromServer: number;
  offsetToServer: number;
  initialServerTime: number;
  initialLocalTime: number;
  performanceDiff: number;

  interval: any;

  async init(page: Page, metrics: any) {
    const { timing, performanceNow } = metrics;

    this.serverTime = timing.initial_server_time;
    this.initialServerTime = timing.initial_server_time;
    this.offsetToServer = timing.offset_to_server;
    this.offsetFromServer = timing.offset_from_server;
    this.initialLocalTime = new Date().getTime();
    this.performanceDiff = performanceNow - perf.now();

    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getReturnTimeFromServer(): number {
    return this.offsetFromServer;
  }

  toServerTime(time: number) {
    return time + this.performanceDiff;
  }

  getElapsedTimeSinceLoad(): number {
    return perf.now() + this.performanceDiff - this.getReturnTimeFromServer();
  }

  getCurrentServerTime(): number {
    return (
      this.initialServerTime +
      this.getReturnTimeFromServer() +
      this.getElapsedTimeSinceLoad()
    );
  }
}

const TimingInstance = new Timing();

export { TimingInstance };
