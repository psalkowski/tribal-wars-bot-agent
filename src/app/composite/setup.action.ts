import { CompositeAction } from './composite.action.js';
import { Action } from '../actions/action.js';
import { OpenGameAction } from '../actions/open-game.action.js';
import { LoginAction } from '../actions/login.action.js';
import { EnterWorldAction } from '../actions/enter-world.action.js';
import { random } from '../utils/random.js';
import { HUMAN_REACTION_MAX_MS, HUMAN_REACTION_MIN_MS } from '../constants/human.js';
import { TimingAction } from '../actions/timing.action.js';
import { OpenOverviewAction } from '../actions/open-overview.action.js';
import { CheckAction } from './check.action.js';
import { TribalDataAction } from '../actions/tribal-data.action.js';
import { PublicVillageLoaderAction } from '../actions/public-village-loader.action.js';

export class SetupAction extends CompositeAction {
  name = 'SetupAction';
  actions: Action[] = [
    new OpenGameAction(),
    new LoginAction(),
    new EnterWorldAction(),
    new CheckAction(),
    new TribalDataAction(),
    new TimingAction(),
    new PublicVillageLoaderAction(),
    new OpenOverviewAction(),
  ];

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }
}
