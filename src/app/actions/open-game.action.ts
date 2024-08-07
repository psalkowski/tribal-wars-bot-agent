import { Page } from 'puppeteer';
import { Action } from './action.js';
import { Service } from 'typedi';
import Navigation from '../core/navigation.js';
import { ScreenType } from '../constants/screen.js';

@Service()
export class OpenGameAction extends Action {
  name = 'OpenGameAction';

  constructor(private readonly navigation: Navigation) {
    super();
  }

  async handle(_: Page): Promise<Action> {
    await this.navigation.goToScreen(ScreenType.OVERVIEW);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const url = page.url();

    return url.includes('chrome:') || url.includes('about:blank');
  }
}
