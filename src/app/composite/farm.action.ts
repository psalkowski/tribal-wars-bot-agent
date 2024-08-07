import { CompositeAction } from './composite.action.js';
import { Action } from '../actions/action.js';
import { OpenFarmAssistanceAction } from '../actions/disabled/open-farm-assistance.action.js';
import { FarmVillageAction } from '../actions/disabled/farm-village.action.js';
import { random } from '../utils/random.js';
import { HUMAN_REACTION_MAX_MS, HUMAN_REACTION_MIN_MS } from '../constants/human.js';
import { Page } from 'puppeteer';
import { FarmAssistantTemplateAction } from '../actions/farm-assistant-template.action.js';
import { getQueryParams } from '../utils/query.js';
import { Game } from '../game/game.js';
import { Container, Service } from 'typedi';
import Logger from '../core/logger.js';

@Service()
export class FarmAction extends CompositeAction {
  protected readonly logger = Logger.getLogger('FarmAction');
  name = 'FarmAction';

  constructor(private readonly open: OpenFarmAssistanceAction, private readonly farm: FarmVillageAction) {
    super();
  }

  async handle(page: Page): Promise<Action> {
    const game = Container.get(Game);

    await this.open.handle(page);

    const query = getQueryParams(page.url());
    const templates = game.getVillageTemplates(Number(query.village));

    for (const template of templates) {
      this.logger.log(`Open overview.`);
      await this.wait();

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

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }
}
