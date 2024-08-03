import { Action } from './action.js';
import { Page } from 'puppeteer';
import { FARM_UNITS } from '../constants/army.js';
import { scrollIntoViewport } from '../utils/scroll-into-viewport.js';
import { IArmy } from '../models/army.js';
import { objectKeys } from '../utils/object.js';

export class FarmAssistantTemplateAction extends Action {
  name = 'FarmAssistantTemplateAction';
  private template: IArmy;

  constructor(template: IArmy) {
    super();

    this.template = template;
  }

  async handle(page: Page): Promise<Action> {
    const form = await page.$('#content_value form:first-child');
    await scrollIntoViewport(page, '#content_value form:first-child');

    for (const unit of FARM_UNITS) {
      const input = await form.$(`input[name="${unit}"]`);

      if (input) {
        await this.setValue(
          page,
          `#content_value form:first-child input[name="${unit}"]`,
          0,
        );
      }
    }

    objectKeys(this.template).map(async (unit) => {
      const input = await form.$(`input[name="${unit}"]`);

      if (input) {
        await this.setValue(
          page,
          `#content_value form:first-child input[name="${unit}"]`,
          this.template[unit],
        );
      }
    });

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
      page.click('#content_value form:first-child input[type="submit"]'),
    ]);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return (await page.$('#content_value')) !== null;
  }

  private async setValue(page: Page, selector: string, value: any) {
    await page.$eval(
      selector,
      (el: Element, value: string) => {
        (el as HTMLInputElement).value = value;
      },
      String(value),
    );
  }
}
