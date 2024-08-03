import { Action } from './action.js';
import { Page } from 'puppeteer';
import { fixTypes } from '../utils/fix-types.js';
import { store } from '../store/store.js';
import { setGame } from '../store/slices/game.slice.js';
import { ITribalGame } from '../models/tribal.js';

declare const TribalWars: any;

export class TribalDataAction extends Action {
  async handle(page: Page): Promise<Action> {
    const data: ITribalGame = await page.evaluate(() =>
      TribalWars.getGameData(),
    );

    store.dispatch(setGame(fixTypes(data)));

    return Promise.resolve(undefined);
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }
}
