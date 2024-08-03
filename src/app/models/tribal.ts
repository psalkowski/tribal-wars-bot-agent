import { IPlayer, IPlayerVillage } from './player.js';
import { IGame } from './game.js';

export interface ITribalGame extends IGame {
  player: IPlayer;
  village: IPlayerVillage;
}
