import { Action } from './action.js';
import { Page } from 'puppeteer';
import { scrollIntoViewport } from '../utils/scroll-into-viewport.js';
import { getQueryParams } from '../utils/query.js';
import { ScreenType } from '../constants/screen.js';
import { CheckAction } from '../composite/check.action.js';
import { Resource } from '../constants/resource.js';
import { average } from '../utils/average.js';
import { MAX_RESOURCE_DIFF } from '../constants/app.js';
import { log } from '../logger/logger.js';
import { OpenOverviewAction } from './open-overview.action.js';
import { waitLikeHuman } from '../utils/wait.js';
import { toNumber } from '../utils/number.js';

export class ResourceTradeAction extends Action {
  name = 'ResourceTradeAction';
  overview = new OpenOverviewAction();
  check = new CheckAction();

  private marketSelector = `#map area[shape="poly"][href$="screen=${ScreenType.MARKET}"]`;
  private tradeLinkSelector = `.vis.modemenu a[href$="mode=own_offer"]`;

  async handle(page: Page): Promise<Action> {
    const marketElement = await page.$(this.marketSelector);
    await page.waitForSelector(this.marketSelector);
    await scrollIntoViewport(page, this.marketSelector);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
      page.evaluate((e: any) => e.click(), marketElement),
    ]);

    await waitLikeHuman();
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
      page.click(this.tradeLinkSelector),
    ]);

    const wood = await this.getResource(Resource.WOOD, page);
    const stone = await this.getResource(Resource.STONE, page);
    const iron = await this.getResource(Resource.IRON, page);
    const currentOffers = await this.getCurrentOffers(page);
    const trades = this.getTrades({ iron, wood, stone }, currentOffers);

    if (trades.length) {
      await waitLikeHuman();
      const sellElement = await page.$('#res_sell_amount');
      await this.clearField(sellElement);
      await sellElement.type('1000');

      await waitLikeHuman();
      const buyElement = await page.$('#res_buy_amount');
      await this.clearField(buyElement);
      await buyElement.type('1000');
    }

    for (const trade of trades) {
      await this.check.handle(page);
      await waitLikeHuman();

      await this.createTrade(page, trade);
    }

    await waitLikeHuman();
    await this.overview.handle(page);

    return null;
  }

  async clearField(field: any) {
    await field.click();
    await field.focus();
    // click three times to select all
    await field.click({ clickCount: 3 });
    await waitLikeHuman();
    await field.press('Backspace');
    await waitLikeHuman();
  }

  async createTrade(page: Page, trade: any): Promise<any> {
    const availableTrades = Number(
      await page.evaluate(
        () =>
          document.querySelector('#market_merchant_available_count')
            .textContent,
      ),
    );
    const count =
      availableTrades < trade.amount ? availableTrades : trade.amount;

    log(
      `[${this.name}] Available trades`,
      availableTrades,
      'trade needed',
      trade.amount,
      'trade calculated',
      count,
    );

    if (count === 0) {
      log(
        `[${this.name}] Skipping, because not enough available trades for`,
        trade,
      );
      return null;
    }

    await page.click(`#res_sell_${trade.from}`);
    await page.click(`#res_buy_${trade.to}`);

    const countElement = await page.$('input[name="multi"]');
    await this.clearField(countElement);
    await countElement.type(`${count}`);

    const timeElement = await page.$('input[name="max_time"]');
    const time = Number(await page.evaluate((x) => x.value, timeElement));

    if (time !== 5) {
      await this.clearField(timeElement);
      await timeElement.type('5');
    }

    log(`[${this.name}] Created trade`, trade);

    await page.click('input[type="submit"]');
    await waitLikeHuman();
  }

  applyCurrentTrades(resources: any, currentTrades: any[]) {
    const cloned = { ...resources };
    currentTrades.forEach((trade: any) => (cloned[trade.to] += trade.amount));

    return cloned;
  }

  getTrades(resources: any, currentTrades: any[]) {
    const resourcesWithCurrentTrades = this.applyCurrentTrades(
      resources,
      currentTrades,
    );
    const resourceAfterTrades = { ...resourcesWithCurrentTrades };
    const middle = Math.floor(
      average(Object.values(resourcesWithCurrentTrades)),
    );
    const belowAvg = [];
    const aboveAvg = [];
    const trades = [];

    for (const prop in resourcesWithCurrentTrades) {
      if (!(prop in resourcesWithCurrentTrades)) {
        continue;
      }

      if (
        Math.abs(resourcesWithCurrentTrades[prop] - middle) < MAX_RESOURCE_DIFF
      ) {
        continue;
      }

      if (resourcesWithCurrentTrades[prop] < middle) {
        belowAvg.push({
          type: prop,
          value: resourcesWithCurrentTrades[prop],
        });
      } else {
        aboveAvg.push({
          type: prop,
          value: resourcesWithCurrentTrades[prop],
        });
      }
    }

    for (const res of aboveAvg) {
      const amountAboveAvg = res.value - middle;

      for (const needs of belowAvg) {
        const amountNeeded = middle - needs.value;
        const amountGiven =
          amountNeeded > amountAboveAvg
            ? amountAboveAvg
            : amountAboveAvg - amountNeeded;

        resourceAfterTrades[res.type] =
          resourceAfterTrades[res.type] - amountGiven;

        trades.push({
          from: res.type,
          to: needs.type,
          amount: amountGiven,
        });
      }
    }

    return trades;
  }

  async getCurrentOffers(page: Page) {
    const ownOffersTable = await page.$('#own_offers_table');
    let results: any[] = [];

    if (ownOffersTable) {
      const ownOffers = await page.$eval('#own_offers_table', (table) => {
        const rows = Array.from(
          table.querySelectorAll('.offer_container'),
        ).filter(Boolean);

        return rows.map((row: any) => {
          const count = Number(row.dataset.count);
          const fromElement = row.querySelector('td:nth-child(2) .icon');
          const toElement = row.querySelector('td:nth-child(3) .icon');
          const from = fromElement.className.match(/(wood|iron|stone)/)[0];
          const to = toElement.className.match(/(wood|iron|stone)/)[0];

          return {
            from,
            to,
            amount: count,
          };
        });
      });

      results = [...results, ...ownOffers];
    }

    const currentTransports = await page.$(
      '#market_status_bar table:nth-child(2)',
    );
    if (currentTransports) {
      const transports = await currentTransports.$$(
        'th:nth-child(1) span.nowrap',
      );
      const array = Array.from(transports);

      for (const element of array) {
        const icon = await element.$('.icon');
        const type = await page.evaluate(
          (e) => e.className.match(/(wood|iron|stone)/)[0],
          icon,
        );
        const amount = await page.evaluate((e) => e.textContent, element);

        results.push({
          to: type,
          amount: toNumber(amount),
        });
      }
    }

    log(`[${this.name}] Existing trades: `, results);

    return results;
  }

  async getResource(resource: Resource, page: Page) {
    const value = await page.$eval(`#${resource}`, (el) => el.textContent);

    return Math.floor(Number(value) / 1000);
  }

  async isSupported(page: Page): Promise<boolean> {
    const query = getQueryParams(page.url());

    return query.screen === ScreenType.OVERVIEW;
  }
}
