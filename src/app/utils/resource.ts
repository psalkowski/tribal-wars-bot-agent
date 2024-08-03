import { toNumber } from './number.js';
import { log } from '../logger/logger.js';

export const getResourceAmount = (
  element: HTMLElement,
  type: string,
): number => {
  log('element', element, type);

  const iconElement: HTMLElement = element.querySelector(
    `.icon.${type}`,
  ) as HTMLElement;
  const amountElement: HTMLElement =
    iconElement.nextElementSibling as HTMLElement;

  log('number..', amountElement.innerText, toNumber(amountElement.innerText));
  return toNumber(amountElement.innerText);
};
