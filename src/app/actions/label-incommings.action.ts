import { Action } from './action.js';
import { Page } from 'puppeteer';
import { Game } from '../game/game.js';
import { scrollIntoViewport } from '../utils/scroll-into-viewport.js';
import { waitLikeHuman } from '../utils/wait.js';
import { Container } from 'typedi';

export class LabelIncomingAction extends Action {
  name = 'LabelIncomingAction';
  selector = '#incomings_amount';

  async handle(page: Page): Promise<Action> {
    const game = Container.get(Game);
    const url = page.url();
    const element = await page.$(this.selector);
    const amount = await page.evaluate(
      (element) => element.textContent,
      element,
    );

    await page.click('#incomings_cell a');
    const all = await page.$('.paged-nav-item[href*="page=-1"');

    if (all) {
      await all.click();
    }

    await waitLikeHuman();

    const selectAll = await page.$('#select_all');
    await scrollIntoViewport(page, '#select_all');

    await selectAll.click();
    await waitLikeHuman();
    await page.click('input[name="label"][type="submit"]');
    await waitLikeHuman();
    await page.goto(url);

    game.setIncomingAttackCount(Number(amount));
    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const game = Container.get(Game);
    const element = await page.$(this.selector);

    if (!element) {
      return false;
    }

    const amount = await page.evaluate(
      (element) => element.textContent,
      element,
    );
    const number = Number(amount || 0);

    return number > 0 && number !== game.getIncomingAttackCount();
  }
}
