import { CompositeAction } from '../composite/composite.action.js';
import { Page } from 'puppeteer';
import { Action } from './action.js';
import { waitLikeHuman } from '../utils/wait.js';

import { ArmyUnit } from '../constants/army.js';
import { Coordinate } from '../models/coordinate.js';
import { Army } from '../game/army.js';
import { FarmManager } from '../manager/farm.manager.js';
import { IArmy } from '../models/army.js';
import { getArmy } from '../store/slices/army.slice.js';
import { store } from '../store/store.js';
import { Service } from 'typedi';
import { objectKeys } from '../utils/object.js';
import Logger from '../core/logger.js';
import { sortBy, SortDirection } from '../utils/array.js';
import { getPlayerVillage } from '../store/slices/player.slice.js';
import { getBarbarianVillagesWithinDistance } from '../store/slices/world-villages.slice.js';
import Navigation from '../core/navigation.js';
import { ScreenType } from '../constants/screen.js';

@Service()
export class FarmFromPlaceAction extends CompositeAction {
  protected readonly logger = Logger.getLogger('FarmFromPlace');

  name = 'FarmFromPlace';

  constructor(private readonly farmManager: FarmManager, private readonly navigation: Navigation) {
    super();
  }

  async handle(page: Page): Promise<Action> {
    const village = getPlayerVillage(store.getState());
    const villageCoordinate = new Coordinate(village.x, village.y);
    const templates = [
      new Army({
        [ArmyUnit.SPEAR]: 20,
        [ArmyUnit.SWORD]: 10,
      }),
      new Army(
        {
          [ArmyUnit.LIGHT]: 10,
        },
        {
          [ArmyUnit.SPY]: 1,
        },
      ),
    ];

    for (const army of templates) {
      await this.handleArmyTemplate(page, army, villageCoordinate);
    }

    return null;
  }

  async handleArmyTemplate(page: Page, army: Army, villageCoordinate: Coordinate) {
    const barbarians = getBarbarianVillagesWithinDistance(villageCoordinate, 10)(store.getState());

    const targets = barbarians
      .map((target) => {
        const coordinate = new Coordinate(target.x, target.y);

        return {
          coordinate,
          target: coordinate.toString(),
          distance: coordinate.distanceTo(villageCoordinate),
        };
      })
      .filter((target) => this.farmManager.canFarm(target.target, army.getAttackDuration() * target.distance))
      .sort(sortBy('distance', SortDirection.ASC));

    if (!targets.length) {
      this.logger.log('No target available to send farm.');
      return;
    }

    for (const target of targets) {
      if ((await this.hasAvailableArmy(army.squad)) === false) {
        this.logger.log('Not enough army to send');
        break;
      }

      await this.navigation.goToScreen(ScreenType.PLACE);

      await this.prepareAttack(page, army, target.target);
      await waitLikeHuman();

      await this.sendAttack(page);
      await waitLikeHuman();

      this.farmManager.create(
        villageCoordinate,
        target.coordinate,
        army.getAttackDuration() * target.distance,
        army.squad,
      );
    }
  }

  async hasAvailableArmy(squad: IArmy) {
    const army = getArmy(store.getState());

    return objectKeys(squad).every((unit) => {
      return squad[unit] <= army[unit];
    });
  }

  async prepareAttack(page: Page, army: Army, target: string) {
    const units = objectKeys(army.squad);
    const availableArmy = getArmy(store.getState());

    await page.waitForSelector('#place_target > input');
    await page.waitForSelector('.units-entry-all');
    await this.setValue(page, '#place_target > input', target);

    for (const unit of units) {
      if (army.squad[unit]) {
        await this.setValue(page, `#command-data-form input[name="${unit}"]`, army.squad[unit]);
      }

      if (army.optional[unit] && availableArmy[unit] >= army.optional[unit]) {
        await this.setValue(page, `#command-data-form input[name="${unit}"]`, army.optional[unit]);
      }
    }

    await this.clickAttackOrDefense(page);
  }

  async clickAttackOrDefense(page: Page) {
    await page.waitForSelector('#target_attack');
    await page.$eval('#target_attack', (element: any) => element.click());
    await page.waitForSelector('#troop_confirm_submit');
  }

  async sendAttack(page: Page) {
    await page.$eval('#troop_confirm_submit', (element: any) => element.click());
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
