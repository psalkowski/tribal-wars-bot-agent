import { Army } from '../../../src/game/army.js';
import { ArmyUnit } from '../../../src/constants/army.js';

describe('Army', () => {
  describe('getSquadDuration()', () => {
    test('should return longest unit duration', () => {
      const army = new Army({
        sword: 1,
        ram: 1,
      });

      expect(army.getAttackDuration()).toEqual(
        army.getUnitDuration(ArmyUnit.RAM),
      );
    });
  });
});
