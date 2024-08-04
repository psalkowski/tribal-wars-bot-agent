import { ArmyUnit } from '../constants/army.js';
import moment from 'moment';
import { IArmy } from '../models/army.js';
import { objectKeys } from '../utils/object.js';

export class Army {
  squad: IArmy;
  optional: IArmy;

  private durations = {
    [ArmyUnit.SPEAR]: 18,
    [ArmyUnit.SWORD]: 22,
    [ArmyUnit.AXE]: 18,
    [ArmyUnit.ARCHER]: 18,
    [ArmyUnit.SPY]: 9,
    [ArmyUnit.LIGHT]: 10,
    [ArmyUnit.MARCHER]: 10,
    [ArmyUnit.HEAVY]: 10,
    [ArmyUnit.RAM]: 30,
    [ArmyUnit.CATAPULT]: 30,
    [ArmyUnit.KNIGHT]: 10,
    [ArmyUnit.SNOB]: 35,
  };

  constructor(squad: Partial<IArmy> = {}, optional: Partial<IArmy> = {}) {
    const defaultArmy: IArmy = {
      [ArmyUnit.SPEAR]: 0,
      [ArmyUnit.SWORD]: 0,
      [ArmyUnit.AXE]: 0,
      [ArmyUnit.ARCHER]: 0,
      [ArmyUnit.SPY]: 0,
      [ArmyUnit.LIGHT]: 0,
      [ArmyUnit.MARCHER]: 0,
      [ArmyUnit.HEAVY]: 0,
      [ArmyUnit.RAM]: 0,
      [ArmyUnit.CATAPULT]: 0,
      [ArmyUnit.KNIGHT]: 0,
      [ArmyUnit.SNOB]: 0,
    };

    this.squad = { ...defaultArmy };
    this.optional = { ...defaultArmy };

    objectKeys(squad).forEach((unit) => {
      this.squad[unit] = Number(squad[unit]) || 0;
    });

    objectKeys(optional).forEach((unit) => {
      this.squad[unit] = Number(optional[unit]) || 0;
    });
  }

  getUnitDuration(unit: keyof IArmy) {
    return Math.round(moment.duration(this.durations[unit], 'minutes').asMilliseconds());
  }

  getDefenseDuration(): number {
    if (this.squad[ArmyUnit.KNIGHT]) {
      return moment.duration(10, 'minutes').asMilliseconds();
    }

    return this.getAttackDuration();
  }

  getAttackDuration(): number {
    const duration = objectKeys(this.squad)
      .filter((key) => this.squad[key])
      .map((key) => this.durations[key]);

    return Math.round(moment.duration(Math.max(...duration), 'minutes').asMilliseconds());
  }
}
