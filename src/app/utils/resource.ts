import { toNumber } from './number.js';
import { log } from '../logger/logger.js';

export const getResourceAmount = (element: HTMLElement, type: string): number => {
  const iconElement: HTMLElement = element.querySelector(`.icon.${type}`) as HTMLElement;
  const amountElement: HTMLElement = iconElement.nextElementSibling as HTMLElement;

  return toNumber(amountElement.innerText);
};
