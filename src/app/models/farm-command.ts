import { IArmy } from './army.js';

export interface IFarmCommand extends IArmy {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  duration: number;
  arriveAt: number;
  returnAt: number;
  worldId: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface IFarmCommandPayload extends IArmy {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  duration: number;
  arriveAt: number;
  returnAt: number;
}
