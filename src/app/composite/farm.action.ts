import { CompositeAction } from './composite.action.js';
import { Action } from '../actions/action.js';
import { OpenFarmAssistanceAction } from '../actions/open-farm-assistance.action.js';
import { FarmVillageAction } from '../actions/farm-village.action.js';
import { random } from '../utils/random.js';
import { HUMAN_REACTION_MAX_MS, HUMAN_REACTION_MIN_MS } from '../constants/human.js';
import { Page } from 'puppeteer';
import { OpenOverviewAction } from '../actions/open-overview.action.js';
import { CheckAction } from './check.action.js';
import { FarmAssistantTemplateAction } from '../actions/farm-assistant-template.action.js';
import { getQueryParams } from '../utils/query.js';
import { Game } from '../game/game.js';
import { Container } from 'typedi';
import Logger from '../core/logger.js';

export class FarmAction extends CompositeAction {
  protected readonly logger = Logger.getLogger('FarmAction');
  name = 'FarmAction';
  actions: Action[] = [];
  check = new CheckAction();
  open = new OpenFarmAssistanceAction();
  farm = new FarmVillageAction();
  overview = new OpenOverviewAction();

  async handle(page: Page): Promise<Action> {
    const game = Container.get(Game);

    await this.open.handle(page);

    const query = getQueryParams(page.url());
    const templates = game.getVillageTemplates(Number(query.village));

    for (const template of templates) {
      this.logger.log(`Open overview.`);
      await this.wait();
      await this.check.handle(page);

      if (game.isAttackPhase()) {
        this.logger.log('BREAK IS ATTACK PHASE');
        break;
      }

      const setTemplate = new FarmAssistantTemplateAction(template.squad);
      await setTemplate.handle(page);

      let next: any = this.farm;

      do {
        if (game.isAttackPhase()) {
          break;
        }

        await this.wait();

        const isSupported = await next?.isSupported(page);
        if (!isSupported) {
          break;
        }
      } while ((next = await next?.handle(page)));
    }

    this.logger.log(`[${this.name}] Back to villages overview`);
    await this.wait();
    await this.overview.handle(page);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }
}
