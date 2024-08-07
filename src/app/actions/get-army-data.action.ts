import { Page } from 'puppeteer';
import { Action } from './action.js';
import { store } from '../store/store.js';
import { setArmy } from '../store/slices/army.slice.js';
import { IArmy } from '../models/army.js';
import { ScreenType } from '../constants/screen.js';
import Logger from '../core/logger.js';
import { Service } from 'typedi';
import Navigation from '../core/navigation.js';

@Service()
export class GetArmyDataAction extends Action {
  private readonly logger = Logger.getLogger('GetArmyDataAction');

  name = 'GetArmyDataAction';

  constructor(private readonly navigation: Navigation) {
    super();
  }

  async handle(page: Page): Promise<Action> {
    await this.navigation.goToScreen(ScreenType.PLACE);

    const army: IArmy = (await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.unitsInput')).reduce((res, element) => {
        const name = element.getAttribute('name');
        const count = Number(element.getAttribute('data-all-count'));

        return {
          ...res,
          [name]: count,
        };
      }, {});
    })) as IArmy;

    this.logger.log('Set army data', JSON.stringify(army));
    store.dispatch(setArmy(army));

    return null;
  }

  async isSupported(_: Page): Promise<boolean> {
    return true;
  }
}
