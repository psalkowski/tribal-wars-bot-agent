import { AttackCommand } from '../commands/attack.command.js';
import { AttackAction } from '../composite/disabled/attack.action.js';
import moment from 'moment';
import { Coordinate } from '../models/coordinate.js';
import { Army } from './army.js';
import { timeout } from '../utils/timeout.js';
import { AttackConfig, Config, VillageConfig } from '../constants/config.js';
import { Service } from 'typedi';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { TribalWarsUrls } from '../constants/urls.js';
import { Page } from 'puppeteer';
import { IArmy } from '../models/army.js';
import Logger from '../core/logger.js';

@Service()
export class Game {
  private readonly logger = Logger.getLogger('Game');
  config: Config;
  commands: AttackCommand[] = [];
  templates: { [key: number]: Army[] } = {};
  incomingAttackCount = 0;
  page: Page;

  get villages() {
    return this.config?.villages || [];
  }

  getIncomingAttackCount() {
    return this.incomingAttackCount || 0;
  }

  setIncomingAttackCount(amount: number) {
    this.incomingAttackCount = amount;
  }

  getVillageCommands(villageId: number) {
    return this.commands
      .filter((command) => command.runAt + 60000 > moment().valueOf())
      .filter((command) => command.village.id === villageId);
  }

  isAllowedToFarm(coordinates: string): boolean {
    const { ignoredFarmVillages } = this.config;

    if (ignoredFarmVillages && Array.isArray(ignoredFarmVillages)) {
      return !ignoredFarmVillages.includes(coordinates);
    }

    return true;
  }

  getVillageTemplates(villageId: number) {
    return this.templates[villageId] || [];
  }

  getCurrentVillage(villageId: number) {
    return this.villages.find(({ id }) => id === villageId);
  }

  setPage(page: Page) {
    this.page = page;
  }

  setConfig(config: Config) {
    this.config = config;
    this.commands = [];
    this.templates = {};

    for (const attack of this.config.attacks) {
      const village = this.villages.find((v) => v.id === attack.village);

      this.commands.push(this.sendAttack(attack, village));
    }

    for (const village of this.config.villages) {
      for (const template of village.farm.templates) {
        if (!(village.id in this.templates)) {
          this.templates[village.id] = [];
        }

        this.templates[village.id].push(new Army(template as IArmy));
      }
    }

    this.commands = this.commands.filter(Boolean);
  }

  /**
   * Should return true if it's 10 minutes before run attack
   */
  isAttackPhase() {
    return this.commands.some(
      (command) =>
        command.runAt < moment().add(10, 'minutes').valueOf() &&
        command.runAt > moment().subtract(1, 'minutes').valueOf(),
    );
  }

  sendAttack(attack: AttackConfig, village: VillageConfig) {
    const command = new AttackCommand(attack, village);
    const diff = command.runAt - moment().valueOf() - 5000; // start 5 seconds before attack

    if (diff < 0) {
      return null;
    }

    this.logger.log(
      `[${village.id}] send attack at `,
      moment(command.runAt).format('DD.MM.YYYY HH:mm:ss.SSS'),
      'and should arrive at',
      moment(command.arriveAt).format('DD.MM.YYYY HH:mm:ss.SSS'),
      '. Army: ',
      JSON.stringify(attack.army),
    );

    timeout(async () => {
      const action = new AttackAction(command);
      await action.handle(this.page);
    }, diff);

    return command;
  }

  getPlaceUrl(coordinate: Coordinate) {
    return parseTribalWarsUrl(TribalWarsUrls.place);
  }
}
