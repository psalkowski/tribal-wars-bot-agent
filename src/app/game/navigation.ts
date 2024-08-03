import { ScreenType } from '../constants/screen.js';
import { getWorldId } from '../store/slices/agent.slice.js';
import { store } from '../store/store.js';

export function getPlaceUrl(villageId: number) {
  return `https://${getWorldId(
    store.getState(),
  )}.plemiona.pl/game.php?village=${villageId}&screen=${ScreenType.PLACE}`;
}

export function getFarmAssistantUrl(villageId: number) {
  return `https://${getWorldId(
    store.getState(),
  )}.plemiona.pl/game.php?village=${villageId}&screen=${ScreenType.FARM}`;
}
