import { Action } from '../action.js';
import { JSHandle, Page } from 'puppeteer';
import { BrowserInstance } from '../../service/browser.js';
import { scrollIntoViewport } from '../../utils/scroll-into-viewport.js';
import { ALL_ARMY_TYPES } from '../../constants/army.js';
import { getQueryParams } from '../../utils/query.js';
import { ScreenType } from '../../constants/screen.js';
import { CheckAction } from '../../composite/check.action.js';
import { Game } from '../../game/game.js';
import { AttackCommand } from '../../commands/attack.command.js';
import { Army } from '../../game/army.js';
import moment from 'moment';
import { FarmManager } from '../../manager/farm.manager.js';
import { Container, Service } from 'typedi';
import { objectKeys } from '../../utils/object.js';
import Logger from '../../core/logger.js';

@Service()
export class FarmVillageAction extends Action {
  private readonly logger = Logger.getLogger('FarmVillageAction');

  name = 'FarmVillageAction';
  count = 0;
  target: any;

  constructor(private readonly game: Game, private readonly check: CheckAction, count = 0, target: any = null) {
    super();

    this.count = count;
    this.target = target;
  }

  canSendFarm(stat: any, commands: AttackCommand[], army: Army): boolean {
    const armyDuration = army.getAttackDuration() * Number(stat.distance) * 2;
    const now = moment().valueOf();
    const intersects = (teamA: any, teamB: any) => {
      const keys = objectKeys(teamA);
      const filtered = keys.filter((unit) => {
        return teamA[unit] && teamB[unit];
      });

      return filtered.length > 0;
    };

    for (const command of commands) {
      const commandRunAt = command.runAt - 600000; // 10 minutes earlier army should be ready

      if (intersects(command.army.squad, army.squad) && now + armyDuration > commandRunAt) {
        this.logger.log('Can not send farm because is too far and we need army for attack.');
        return false;
      }
    }

    return true;
  }

  async handle(page: Page): Promise<Action> {
    await this.check.handle(page);

    const farmManager = Container.get(FarmManager);
    const { village } = getQueryParams(page.url());
    const [armyTemplate] = await getTemplates();
    const [templateA]: any = await getAvailableTemplate();
    const army = new Army(armyTemplate);
    const commands = this.game.getVillageCommands(Number(village));

    if (!templateA) {
      this.logger.log('Can not proceed, back to overview');
      return null;
    }

    const rawStats = await this.getStats(page);
    const stats = rawStats.filter((stat: any) => this.canSendFarm(stat, commands, army));

    // if there are raw stats, but there is no filtered, that mean,
    // we can not sent any more attack farm, because we need army for real attack
    if (!stats.length && rawStats.length) {
      this.logger.log(`Skipping, we need army for attack.`);
      return null;
    }

    const filtered = stats.filter((stat: any) =>
      farmManager.canFarm(stat.coordinate, army.getAttackDuration() * Number(stat.distance)),
    );

    if (filtered.length) {
      const next = filtered.shift();

      if (next) {
        if (this.count >= 3 && this.target === next.id) {
          this.count = 0;

          return null;
        }

        const template = templateA ? '.farm_icon_a' : null;
        this.logger.log(`Next farm`, next, template);

        if (!template) {
          return null;
        }

        const selector = `#${next.id} ${template}`;
        const button = await page.$(selector);
        const prop = await button.getProperty('className');
        const className = (await prop.jsonValue()) as string;

        if (className.split(' ').includes('farm_icon_disabled')) {
          this.logger.log(`Button contain disabled class name`);
          return null;
        }

        await scrollIntoViewport(page, selector);

        await button?.click();

        // farmManager.create(
        //
        //   next.coordinate,
        //   army.getAttackDuration() * Number(next.distance),
        //   army,
        // );

        this.logger.log(`Attack has been sent`);

        if (this.target !== next.id) {
          this.count = 0;
        }

        return new FarmVillageAction(this.count++, next.id);
      }
    }

    const nextPage = await this.getNextPage(page);

    if (nextPage !== null) {
      const clicked = await page.evaluate((e: any) => {
        if (!e) {
          return false;
        }

        e.click();

        return true;
      }, nextPage);

      if (clicked) {
        return new FarmVillageAction();
      }
    }

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const query = getQueryParams(page.url());

    return query.screen === ScreenType.FARM;
  }

  async getStats(page: Page): Promise<any> {
    return page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('#plunder_list th'));
      const distanceIndex = headers
        .map((header, index) => {
          if (header.querySelector('img[src$="rechts.png"]')) {
            return index;
          }

          return null;
        })
        .filter(Boolean)[0];

      const rows = Array.from(document.querySelectorAll('#plunder_list tr[id*=village]'));

      return (
        rows
          // .filter(row => !row.querySelector('img[src*="attack.png"]'))
          .filter((row) => row.querySelector('img[src$="green.png"]'))
          .filter((row) => !row.querySelector('.farm_icon_a').classList.contains('farm_icon_disabled'))
          .map((row: any) => {
            const toNumber = (str: string) => Number(str.replace(/[\s.]/g, ''));
            const getResourceAmount = (element: HTMLElement, type: string) => {
              const iconElement = element.querySelector(`.icon.${type}`);

              // that's the case when we do not have a report for that village for some reason
              if (!iconElement) {
                return 9999;
              }

              const amountElement = iconElement.nextElementSibling as HTMLElement;

              return toNumber(amountElement.innerText);
            };

            const stone = getResourceAmount(row, 'stone');
            const wood = getResourceAmount(row, 'wood');
            const iron = getResourceAmount(row, 'iron');
            const village = row.querySelector('td:nth-child(4) > a').textContent;
            const distance = Number(row.querySelector(`td:nth-child(${distanceIndex + 1})`).textContent);

            return {
              stone,
              iron,
              wood,
              distance,
              coordinate: village.match(/\(([0-9|]+)\)/)[1],
              id: row.id,
              total: stone + iron + wood,
            };
          })
          .sort((a, b) => b.total - a.total)
      );
    });
  }

  async getNextPage(page: Page): Promise<JSHandle | null> {
    const currentPage = await page.$('#plunder_list_nav strong.paged-nav-item');

    if (currentPage !== null) {
      await scrollIntoViewport(page, '#plunder_list_nav strong.paged-nav-item');

      return await page.evaluateHandle((el) => el.nextElementSibling, currentPage);
    }

    return null;
  }
}

const getAvailableTemplate = async () => {
  const templates: any[] = await getTemplates();
  const available: any = await getAvailableArmy();

  const availableTemplates = templates.map((template: any) => {
    for (const key in template) {
      if (available[key] < template[key]) {
        return false;
      }
    }

    return true;
  });

  return availableTemplates;
};

const getTemplates = async () => {
  const page = BrowserInstance.getPage();

  return await page.evaluate(() => {
    const forms = Array.from(document.querySelectorAll('form[action*="mode=farm"]'));

    return forms.map((form) => {
      const value: any = {};

      Array.from(form.querySelectorAll('input[type="text"]'))
        .map((input) => input as any)
        .filter((input) => Number(input.value))
        .forEach((input) => {
          value[input.name] = input.value;
        });

      return value;
    });
  });
};

const getAvailableArmy = async () => {
  const page = BrowserInstance.getPage();

  return await page.evaluate((armyTypes) => {
    const value: any = {};

    armyTypes.forEach((type) => {
      const available = document.getElementById(type);

      if (!available) {
        value[type] = 0;
        return;
      }

      value[type] = Number(available.innerText);
    });

    return value;
  }, ALL_ARMY_TYPES);
};
