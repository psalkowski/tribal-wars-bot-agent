import { CompositeAction } from './composite.action.js';
import { OpenGameAction } from '../actions/open-game.action.js';
import { LoginAction } from '../actions/login.action.js';
import { EnterWorldAction } from '../actions/enter-world.action.js';
import { random } from '../utils/random.js';
import { HUMAN_REACTION_MAX_MS, HUMAN_REACTION_MIN_MS } from '../constants/human.js';
import { TimingAction } from '../actions/timing.action.js';
import { OpenOverviewAction } from '../actions/disabled/open-overview.action.js';
import { CheckAction } from './check.action.js';
import { TribalDataAction } from '../actions/tribal-data.action.js';
import { Service } from 'typedi';

@Service()
export class SetupAction extends CompositeAction {
  name = 'SetupAction';

  constructor(
    private readonly openGame: OpenGameAction,
    private readonly login: LoginAction,
    private readonly enterWorld: EnterWorldAction,
    private readonly check: CheckAction,
    private readonly tribalData: TribalDataAction,
    private readonly timing: TimingAction,
    private readonly openOverview: OpenOverviewAction,
  ) {
    super();

    this.actions = [
      this.openGame,
      this.login,
      this.enterWorld,
      this.check,
      this.tribalData,
      this.timing,
      this.openOverview,
    ];
  }

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }

  getNextRun(): number {
    if (!this.lastRunAt) {
      return 0;
    }

    return Infinity;
  }
}
