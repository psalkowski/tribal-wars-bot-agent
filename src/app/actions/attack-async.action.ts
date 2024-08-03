import { Action } from './action.js';
import { Page } from 'puppeteer';
import { TribalGameData } from '../game/tribal-data.js';
import { ScreenType } from '../constants/screen.js';
import { getWorldId } from '../store/slices/agent.slice.js';
import { store } from '../store/store.js';
import { NoopAction } from './noop.action.js';

declare let TribalWars: any;
declare let VillageContext: any;

export class AttackAsyncAction extends Action {
  constructor(private villageId: number, private targetId: number) {
    super();
  }

  private async cookiesToString(page: Page): Promise<string> {
    const cookies = await page.cookies();

    return cookies
      .map(
        (cookie: { name: string; value: string }) =>
          `${cookie.name}: ${cookie.value};`,
      )
      .join(' ');
  }

  async handle(page: Page): Promise<Action> {
    const data: TribalGameData = await page.evaluate(() =>
      TribalWars.getGameData(),
    );
    const urls: { [key: string]: string } = await page.evaluate(
      () => VillageContext._urls,
    );

    const cookie = await this.cookiesToString(page);
    const endpoint = `https://${getWorldId(store.getState())}/game.php`;
    const baseUrl = `${endpoint}?village=${this.villageId}&screen=${ScreenType.PLACE}`;
    // GET
    const getPopupUrl = `${baseUrl}&target=${this.targetId}&ajax=command`;
    // POST
    const confirmAttackUrl = `${baseUrl}&ajax=confirm`;
    // POST
    const submitUrl = `${baseUrl}&ajax=popup_command`;

    fetch(getPopupUrl, {
      headers: {
        accept: '*/*',
        cookie,
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36',
        'tribalwars-ajax': '1',
      },
      method: 'GET',
    });
    console.log({
      getPopupUrl,
      confirmAttackUrl,
      submitUrl,
    });

    return Promise.resolve(new NoopAction());
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }
}
