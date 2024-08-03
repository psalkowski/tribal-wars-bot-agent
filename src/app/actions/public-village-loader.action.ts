import { Action } from './action.js';
import { Page } from 'puppeteer';
import { parse } from 'csv-parse/sync';
import { store } from '../store/store.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { TribalWarsUrls } from '../constants/urls.js';
import { IVillage } from '../models/village.js';
import { fixTypes } from '../utils/fix-types.js';
import {
  getWorldVillagesLastCheck,
  setWorldVillages,
} from '../store/slices/world-villages.slice.js';
import moment from 'moment';

export class PublicVillageLoaderAction extends Action {
  name = 'PublicVillageLoaderAction';

  async handle(page: Page): Promise<Action> {
    const endpoint = parseTribalWarsUrl(TribalWarsUrls.public_villages);
    const response = await fetch(endpoint).then((res) => res.text());
    const records = parse(response, {
      columns: false,
      skip_empty_lines: true,
    });

    const villages: IVillage[] = records.map(
      (record: [string, string, string, string, string, string, string]) => {
        const [village_id, name, x, y, player_id, points, rank] = record;

        return fixTypes({
          id: village_id,
          name,
          x,
          y,
          owner: player_id,
          points,
          rank,
        });
      },
    );

    store.dispatch(setWorldVillages(villages));

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    const lastCheck = getWorldVillagesLastCheck(store.getState());

    // 24 hours
    return !(lastCheck && moment().valueOf() - lastCheck < 86400000);
  }
}
