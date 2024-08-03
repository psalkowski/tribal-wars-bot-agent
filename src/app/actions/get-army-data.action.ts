import { Page } from 'puppeteer';
import { Action } from './action.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { TribalWarsUrls } from '../constants/urls.js';
import { store } from '../store/store.js';
import { setArmy } from '../store/slices/army.slice.js';
import { IArmy } from '../models/army.js';
import { getQueryParams } from '../utils/query.js';
import { ScreenType } from '../constants/screen.js';
import Logger from '../core/logger.js';

export class GetArmyDataAction extends Action {
  private readonly logger = Logger.getLogger('GetArmyDataAction');

  name = 'GetArmyDataAction';

  async handle(page: Page): Promise<Action> {
    await this.navigateToPlace(page);

    const army: IArmy = (await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.unitsInput')).reduce(
        (res, element) => {
          const name = element.getAttribute('name');
          const count = Number(element.getAttribute('data-all-count'));

          return {
            ...res,
            [name]: count,
          };
        },
        {},
      );
    })) as IArmy;

    this.logger.log('Set army data', army);
    store.dispatch(setArmy(army));

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    // const lastCheck = getArmyLastCheck(store.getState());
    //
    // // check it once per 20 minutes
    // return lastCheck < moment().subtract(20, "minutes").valueOf();
    return true;
  }

  async navigateToPlace(page: Page) {
    const { screen } = getQueryParams(page.url());

    if (screen !== ScreenType.PLACE) {
      await page.goto(parseTribalWarsUrl(TribalWarsUrls.place));
    }
  }
}
