import { CompositeAction } from './composite.action.js';
import { Page } from 'puppeteer';
import { Action } from '../actions/action.js';
import { wait } from '../utils/wait.js';
import { BrowserInstance } from '../service/browser.js';
import { AttackCommand } from '../commands/attack.command.js';
import moment from 'moment';
import { ALL_ARMY_TYPES } from '../constants/army.js';
import { Latency } from '../utils/latency.js';
import { Game } from '../game/game.js';
import { Container } from 'typedi';
import Logger from '../core/logger.js';

export class AttackAction extends CompositeAction {
  protected readonly logger = Logger.getLogger('AttackAction');

  private readonly command: AttackCommand;

  constructor(command: AttackCommand) {
    super();

    this.command = command;
  }

  async handle(page: Page): Promise<Action> {
    const game = Container.get(Game);
    const commandPage = await this.openPage(game.getPlaceUrl(this.command.source));
    const latency = await Latency.getLatency(commandPage.url());

    try {
      await this.prepareAttack(commandPage);

      await commandPage.evaluate(
        (event) => {
          return new Promise((resolve) => {
            const timing = (window as any).Timing;
            const { runAt, latency } = event;
            const diff = timing.getCurrentServerTime();
            const element: any = document.querySelector('#troop_confirm_go');

            setTimeout(() => {
              element.click();

              resolve(null);
            }, runAt - diff - latency + timing.offset_to_server);
          });
        },
        { runAt: this.command.runAt, latency },
      );

      this.logger.log(
        '[' + this.command.village.id + '] Finalizing attacks. Should arrive at',
        moment(this.command.arriveAt).format('HH:mm:ss.SSS'),
        'with ',
        this.command.army.squad,
      );
    } catch (e) {
      console.error(e);
    }

    await wait(2000);
    await commandPage.close();

    return null;
  }

  async openPage(url: string): Promise<Page> {
    const browser = BrowserInstance.getBrowser();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.resourceType() === 'image') request.abort();
      else request.continue();
    });
    await page.goto(url);
    await page.waitForSelector('#command-data-form');

    return page;
  }

  async prepareAttack(page: Page) {
    const {
      army: { squad },
      catapultTarget,
      target,
    } = this.command;
    await page.waitForSelector('#place_target > input');
    await page.waitForSelector('.units-entry-all');
    await this.setValue(page, '#place_target > input', target.toString());

    ALL_ARMY_TYPES.filter((name) => squad[name]).map(async (name) => {
      const amount = squad[name];

      if (amount > 0) {
        await this.setValue(page, `#command-data-form input[name="${name}"]`, squad[name]);
      } else {
        const element = await page.$(`#units_entry_all_${name}`);
        const text = await page.evaluate((element) => element.textContent, element);
        const all = text.replace('(', '').replace(')', '');

        await this.setValue(page, `#command-data-form input[name="${name}"]`, all);
      }
    });

    if (catapultTarget && (await page.$('select[name="building"]'))) {
      await page.select('select[name="building"]', catapultTarget);
    }

    await this.clickAttackOrDefense(page);
  }

  async clickAttackOrDefense(page: Page) {
    const selector = this.command.isAttack() ? '#target_attack' : '#target_support';

    await page.waitForSelector(selector);
    await page.$eval(selector, (element: any) => element.click());
    await page.waitForSelector('#troop_confirm_go');
  }

  async sendAttack(page: Page) {
    await page.$eval('#troop_confirm_go', (element: any) => element.click());
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }

  private async setValue(page: Page, selector: string, value: any) {
    await page.$eval(
      selector,
      (el: Element, value) => {
        (el as HTMLInputElement).value = value;
      },
      String(value),
    );
  }
}
