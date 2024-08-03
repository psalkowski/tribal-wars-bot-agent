import { Army } from '../game/army.js';
import { Coordinate } from '../models/coordinate.js';
import moment from 'moment';
import {
  AttackConfig,
  AttackType,
  VillageConfig,
} from '../constants/config.js';
import { BuildingType } from '../constants/buildings.js';

export class AttackCommand {
  army: Army;
  source: Coordinate;
  target: Coordinate;
  runAt: number;
  arriveAt: number;
  village: VillageConfig;
  type: AttackType;
  catapultTarget: BuildingType;

  constructor(attack: AttackConfig, village: VillageConfig) {
    this.village = village;
    this.army = new Army(attack.army);
    this.source = Coordinate.from(village.coordinate);
    this.target = Coordinate.from(attack.target);
    this.type = attack.type;
    this.catapultTarget = attack.catapultTarget;

    if (attack.arriveAt) {
      this.arriveAt = moment(
        attack.arriveAt,
        'DD.MM.YYYY HH:mm:ss.SSS',
      ).valueOf();
      this.runAt = this.arriveAt - this.getDistanceDuration();
    } else {
      this.runAt = moment(attack.runAt, 'DD.MM.YYYY HH:mm:ss.SSS').valueOf();
      this.arriveAt = this.runAt + this.getDistanceDuration();
    }
  }

  getDistance(): number {
    return this.source.distanceTo(this.target);
  }

  isDefense(): boolean {
    return this.type === AttackType.DEFENSE;
  }

  isAttack(): boolean {
    return this.type === AttackType.ATTACK;
  }

  getDistanceDuration() {
    const distance = this.getDistance();
    const duration = this.isAttack()
      ? this.army.getAttackDuration()
      : this.army.getDefenseDuration();

    return Math.round((distance * duration) / 1000) * 1000;
  }
}
