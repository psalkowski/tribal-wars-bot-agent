import { CheckAction } from '../composite/check.action.js';
import { SetupAction } from '../composite/setup.action.js';
import { Page } from 'puppeteer';
import { waitLikeHuman } from '../utils/wait.js';
import { FarmAction } from '../composite/farm.action.js';
import { Game } from '../game/game.js';
import { OpenVillageAction } from '../composite/open-village.action.js';
import { ResourceTradeAction } from '../actions/resource-trade.action.js';
import moment from 'moment';
import { FarmFromPlaceAction } from '../actions/farm-from-place.action.js';
import { LabelIncomingAction } from '../actions/label-incommings.action.js';
import { getBarbarianVillagesWithinDistance } from '../store/slices/world-villages.slice.js';
import { Coordinate } from '../models/coordinate.js';
import { store } from '../store/store.js';
import { getPlayerVillages } from '../store/slices/player.slice.js';
import { IPlayerVillage } from '../models/player.js';
import { GetArmyDataAction } from '../actions/get-army-data.action.js';
import { Container } from 'typedi';
import { ReadReportsAction } from '../actions/read-reports.action.js';
import Navigation from '../core/navigation.js';
import { ScreenType } from '../constants/screen.js';
import Logger from '../core/logger.js';

export abstract class ActionManager {
  private static readonly logger = Logger.getLogger('ActionManager');
  static setup: SetupAction = new SetupAction();
  // static wait = new WaitAction(60000, 180000);

  static market = new ResourceTradeAction();
  static lastMarketRun = moment().subtract(61, 'minutes');
  static checkAction = new CheckAction();
  static labelIncomingAttacks = new LabelIncomingAction();
  static armyDataAction = new GetArmyDataAction();

  static async run(page: Page): Promise<void> {
    const battleReportAction = Container.get(ReadReportsAction);
    const navigation = Container.get(Navigation);
    const game = Container.get(Game);
    this.logger.log('Action Manager started.');

    await this.setup.handle(page);
    await navigation.goToScreen(ScreenType.OVERVIEW);

    await waitLikeHuman();

    await battleReportAction.handle(page);

    await navigation.goToScreen(ScreenType.OVERVIEW);

    const nextRun = this.lastMarketRun.clone().add(1, 'hour');

    const playerVillages = getPlayerVillages(store.getState());

    for (const village of playerVillages) {
      if (await this.labelIncomingAttacks.isSupported(page)) {
        await this.labelIncomingAttacks.handle(page);
      }

      if (game.isAttackPhase()) {
        this.logger.log('BREAK IS ATTACK PHASE 2222');
        break;
      }

      const openVillage = new OpenVillageAction(village.id);
      if (await openVillage.isSupported(page)) {
        await openVillage.handle(page);
      }

      if (nextRun.isBefore(moment())) {
        await this.market.handle(page);
      }

      if (await this.checkAction.isSupported(page)) {
        await this.checkAction.handle(page);
      }

      await this.armyDataAction.handle(page);

      const action = this.getFarmAction(village);
      const isSupported = await action.isSupported(page);

      if (isSupported) {
        await waitLikeHuman();
        this.logger.log('Handle next action:', action.name);
        await action.handle(page);
      }
    }

    if (nextRun.isBefore(moment())) {
      this.lastMarketRun = moment();
    }

    // await this.wait.handle(page);
    await navigation.goToScreen(ScreenType.OVERVIEW);

    this.logger.log('Action Manager finished.');
  }

  static getFarmAction(village: IPlayerVillage) {
    const game = Container.get(Game);

    if (game.config.modules.farmAssistant) {
      return new FarmAction();
    }

    const barbarianVillages = getBarbarianVillagesWithinDistance(new Coordinate(village.x, village.y))(
      store.getState(),
    );

    return new FarmFromPlaceAction(village, barbarianVillages);
  }
}
