import { CompositeAction } from './composite.action.js';
import { random } from '../utils/random.js';
import { HUMAN_REACTION_MAX_MS, HUMAN_REACTION_MIN_MS } from '../constants/human.js';
import { Service } from 'typedi';
import { ResourceTradeAction } from '../actions/resource-trade.action.js';

@Service()
export class MarketAction extends CompositeAction {
  name = 'MarketAction';

  constructor(private readonly resourceTradeAction: ResourceTradeAction) {
    super();

    this.actions = [this.resourceTradeAction];
  }

  getTimeout(): number {
    return random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS);
  }

  // disabled for now
  getNextRun(): number {
    return Infinity;
  }
}
