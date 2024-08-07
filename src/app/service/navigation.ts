import { getWorldId } from '../store/slices/agent.slice.js';
import { store } from '../store/store.js';
import { getPlayerId, getPlayerVillageId } from '../store/slices/player.slice.js';
import { objectKeys } from '../utils/object.js';

export const parseTribalWarsUrl = (url: string) => {
  const state = store.getState();
  const keys = {
    __world__: getWorldId(state) || '',
    __player__: getPlayerId(state) || '',
    __village__: getPlayerVillageId(state) || '',
  };

  return objectKeys(keys).reduce((url, key) => url.replace(key, `${keys[key]}`), url);
};
