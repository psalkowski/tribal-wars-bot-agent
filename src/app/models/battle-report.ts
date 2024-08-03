export interface IBattleReport {
  luck: number;
  battleAt: number;
  id: number;
  origin: IBattleReportPlayer;
  destination: IBattleReportPlayer;
  attackerArmy: Omit<IBattleReportArmy, 'militia'>;
  defenderArmy: IBattleReportArmy;
  loot: IBattleReportLoot;
  status: FightStatus;
  createdAt?: number;
  updatedAt?: number;
}

export interface IBattleReportLoot {
  wood: number;
  stone: number;
  iron: number;
  total: number;
  capacity: number;
}

export interface IBattleReportPlayer {
  villageId: number;
  playerId: number;
  x: number;
  y: number;
}

export interface IBattleReportArmy {
  spear: IBattleReportArmyBalance;
  sword: IBattleReportArmyBalance;
  axe: IBattleReportArmyBalance;
  archer: IBattleReportArmyBalance;
  spy: IBattleReportArmyBalance;
  light: IBattleReportArmyBalance;
  marcher: IBattleReportArmyBalance;
  heavy: IBattleReportArmyBalance;
  ram: IBattleReportArmyBalance;
  catapult: IBattleReportArmyBalance;
  knight: IBattleReportArmyBalance;
  snob: IBattleReportArmyBalance;
  militia: IBattleReportArmyBalance;
}

export interface IBattleReportArmyBalance {
  sent: number;
  lost: number;
}

export interface IApiBattleReport {
  id: number;
  status: FightStatus;
  luck: number;
  attackerVillageId: number;
  attackerPlayerId: number;
  attackerX: number;
  attackerY: number;
  attackerArmy: Omit<IBattleReportArmy, 'militia'>;
  defenderVillageId: number;
  defenderPlayerId: number;
  defenderX: number;
  defenderY: number;
  defenderArmy: IBattleReportArmy;
  lootedWood: number;
  lootedIron: number;
  lootedStone: number;
  lootedTotal: number;
  lootCapacity: number;
  battleAt: number;
  createdAt?: number;
  updatedAt?: number;
}

export enum FightStatus {
  CLEAN = 'clean',
  SCAN = 'scan',
  PARTIAL_LOSE = 'partial_lose',
  FULL_LOSE = 'full_lose',
}
