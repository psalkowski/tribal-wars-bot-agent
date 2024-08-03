import { Action } from './action.js';
import { Page } from 'puppeteer';
import { NoopAction } from './noop.action.js';
import Logger from '../core/logger.js';
import Navigation from '../core/navigation.js';
import { Service } from 'typedi';
import { ScreenType } from '../constants/screen.js';
import { ReportType } from '../constants/report.js';
import { createBattleReport, getLastBattleReport } from '../store/slices/battle-report.slice.js';
import { dispatch, store } from '../store/store.js';
import { BattleReportExtractor } from '../extractor/battle-report.extractor.js';
import { IBattleReport } from '../models/battle-report.js';
import { waitLikeHuman } from '../utils/wait.js';
import fs from 'fs';

@Service()
export class ReadReportsAction extends Action {
  private readonly logger = Logger.getLogger('ReadReportsAction');

  name = 'ReadReportsAction';

  constructor(private readonly navigation: Navigation, private readonly extractor: BattleReportExtractor) {
    super();
  }

  async handle(page: Page): Promise<Action> {
    const lastReport = getLastBattleReport(store.getState());
    const lastReportId = lastReport?.id;

    await this.navigation.goToScreen(ScreenType.REPORT, {
      mode: ReportType.ATTACK,
    });

    await Promise.all([
      page.click('.report-link:first-child'),
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
    ]);

    let report: IBattleReport = null;
    do {
      this.logger.debug('Extracting report from ', page.url());

      const content = await page.content();
      const prevButton = await page.$('#report-prev');

      try {
        report = this.extractor.extract(content);

        if (lastReportId === report.id) {
          this.logger.debug('Last Report Id is the same as current report. Stopping report reader.');

          break;
        }

        await dispatch(createBattleReport(report)).unwrap();

        if (!prevButton) {
          this.logger.debug('Previous button has not been found.');
          break;
        }

        await waitLikeHuman();

        this.logger.debug('Open previous report');

        await Promise.all([
          page.click('#report-prev'),
          page.waitForNavigation({
            waitUntil: 'domcontentloaded',
          }),
        ]);
      } catch (e) {
        this.logger.error('page', page.url());
        fs.writeFileSync(`error_${new Date().getTime()}.html`, content);
        throw e;
      }
    } while (true);

    return new NoopAction();
  }

  async isSupported(_: Page): Promise<boolean> {
    return true;
  }
}
