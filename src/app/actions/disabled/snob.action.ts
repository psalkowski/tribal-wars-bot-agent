import { Action } from '../action.js';
import { Page } from 'puppeteer';

export class SnobAction extends Action {
  name = 'SnobAction';

  async handle(page: Page): Promise<Action> {
    // hardcode sending attack with snob
    await page.goto('https://pl156.plemiona.pl/game.php?village=13134&screen=place&target=11135');

    await page.waitForSelector('#command-data-form');
    await page.$eval('#command-data-form input[name=axe]', (el: HTMLInputElement) => (el.value = '100'));
    await page.$eval('#command-data-form input[name=spy]', (el: HTMLInputElement) => (el.value = '1'));
    await page.$eval('#command-data-form input[name=snob]', (el: HTMLInputElement) => (el.value = '1'));

    await page.click('#command_actions #target_attack');
    await page.waitForSelector('#command-data-form');
    await page.click('#command-data-form #troop_confirm_go');
    await page.waitForSelector('#menu_row2_village');
    await page.click('#menu_row2_village a');

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$('#unit_overview_table .all_unit .unit_link[data-unit="snob"]')) !== null;
  }
}
