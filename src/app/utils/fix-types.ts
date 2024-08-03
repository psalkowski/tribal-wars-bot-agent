import { objectKeys } from './object.js';

/**
 * Method useful for fixing numbers when evaluating JS on HTML
 *
 * @param object
 */
export const fixTypes = <T>(object: any): T => {
  if (!object || typeof object !== 'object') {
    return object;
  }

  return {
    ...(objectKeys(object).reduce((prev, key) => {
      const value = object[key];

      if (!value && value !== '0') {
        return { ...prev, [key]: value };
      }

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return { ...prev, [key]: value.map(fixTypes) };
        }

        return { ...prev, [key]: fixTypes(value) };
      }

      if (`${key as string}`.includes('date')) {
        const timestamp =
          `${value}`.length === 10 ? Number(value) * 1000 : Number(value);

        return { ...prev, [key]: timestamp };
      }

      if (!isNaN(Number(value))) {
        return { ...prev, [key]: Number(value) };
      }

      return { ...prev, [key]: value };
    }, {}) as T),
  };
};
