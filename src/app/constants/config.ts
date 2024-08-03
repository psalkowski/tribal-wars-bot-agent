import { IArmy } from '../models/army.js';
import { BuildingType } from './buildings.js';

export interface VillageConfig {
  id: number;
  name: string;
  coordinate: string;
  farm: FarmConfig;
}

export enum AttackType {
  ATTACK = 'attack',
  DEFENSE = 'defense',
}

export interface AttackConfig {
  village: number;
  target: string;
  army: IArmy;
  arriveAt?: string;
  runAt?: string;
  type: AttackType;
  catapultTarget?: BuildingType;
}

export interface FarmConfig {
  enabled: boolean;
  templates: Array<Partial<IArmy>>;
}

export interface Config {
  modules: {
    farmAssistant: boolean;
  };
  villages: VillageConfig[];
  attacks: AttackConfig[];
  ignoredFarmVillages: string[];
}

export const FarmTemplates = {
  LIGHT: {
    light: 5,
  },
  LIGHT_BIGGER: {
    light: 20,
  },
  MARCHER: {
    marcher: 10,
  },
};
