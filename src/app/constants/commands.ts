/**
 * Property: data-command-type
 */
export enum CommandType {
  RETURN = 'return',
  ATTACK = 'attack',
}

export interface CommandArmy {
  spear?: number;
  sword?: number;
  axe?: number;
  archer?: number;
  spy?: number;
  light?: number;
  marcher?: number;
  heavy?: number;
  knight?: number;
  ram?: number;
  catapult?: number;
  snob?: number;
}
