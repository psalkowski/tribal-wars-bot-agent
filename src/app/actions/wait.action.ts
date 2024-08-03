import { Action } from './action.js';
import { wait } from '../utils/wait.js';
import { Page } from 'puppeteer';
import {
  HUMAN_REACTION_MAX_MS,
  HUMAN_REACTION_MIN_MS,
} from '../constants/human.js';
import { random } from '../utils/random.js';
import { log } from '../logger/logger.js';

export class WaitAction extends Action {
  name = 'WaitAction';

  private readonly min: number;
  private readonly max: number;

  constructor(
    min: number = HUMAN_REACTION_MIN_MS,
    max: number = HUMAN_REACTION_MAX_MS,
  ) {
    super(0);

    this.min = min;
    this.max = max;
  }

  async handle(page: Page): Promise<Action> {
    const time = random(this.min, this.max);

    log(`[${this.name}] Waiting ${time / 1000}s`);

    await wait(time);

    return null;
  }

  async isSupported(page: Page): Promise<boolean> {
    return true;
  }
}
