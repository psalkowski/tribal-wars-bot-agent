import { Page } from 'puppeteer';
import { Action } from './action.js';
import { Container } from 'typedi';
import Navigation from '../core/navigation.js';
import { ScreenType } from '../constants/screen.js';

export class OpenGameAction extends Action {
  name = 'OpenGameAction';

  async handle(page: Page): Promise<Action> {
    const navigation = Container.get(Navigation);

    await navigation.goToScreen(ScreenType.OVERVIEW);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const url = page.url();

    return url.includes('chrome:') || url.includes('about:blank');
  }
}
