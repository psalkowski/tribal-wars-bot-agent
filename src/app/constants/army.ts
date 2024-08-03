export interface Army {
  unit: ArmyUnit;
  available: number;
  total: number;
}

export enum ArmyUnit {
  SPEAR = 'spear',
  SWORD = 'sword',
  AXE = 'axe',
  ARCHER = 'archer',
  SPY = 'spy',
  LIGHT = 'light',
  MARCHER = 'marcher',
  HEAVY = 'heavy',
  RAM = 'ram',
  CATAPULT = 'catapult',
  KNIGHT = 'knight',
  SNOB = 'snob',
}

export const ALL_ARMY_TYPES = [
  ArmyUnit.SPEAR,
  ArmyUnit.SWORD,
  ArmyUnit.AXE,
  ArmyUnit.ARCHER,
  ArmyUnit.SPY,
  ArmyUnit.LIGHT,
  ArmyUnit.MARCHER,
  ArmyUnit.HEAVY,
  ArmyUnit.RAM,
  ArmyUnit.CATAPULT,
  ArmyUnit.KNIGHT,
  ArmyUnit.SNOB,
];

export const FARM_UNITS = [
  ArmyUnit.SPEAR,
  ArmyUnit.SWORD,
  ArmyUnit.AXE,
  ArmyUnit.ARCHER,
  ArmyUnit.SPY,
  ArmyUnit.LIGHT,
  ArmyUnit.MARCHER,
  ArmyUnit.HEAVY,
];
