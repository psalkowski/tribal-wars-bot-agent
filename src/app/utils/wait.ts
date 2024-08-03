import { random } from './random.js';
import {
  HUMAN_REACTION_MAX_MS,
  HUMAN_REACTION_MIN_MS,
} from '../constants/human.js';
import { timeout } from './timeout.js';

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    timeout(resolve, ms);
  });
export const waitLikeHuman = async () =>
  await wait(random(HUMAN_REACTION_MIN_MS, HUMAN_REACTION_MAX_MS));
