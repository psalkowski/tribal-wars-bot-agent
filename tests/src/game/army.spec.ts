import { Army } from '../../../src/game/army';
import { ArmyUnit } from '../../../src/constants/army';

describe('Army', () => {
    describe('getSquadDuration()', () => {
        test('should return longest unit duration', () => {
            const army = new Army({
                sword: 1,
                ram: 1,
            });

            expect(army.getAttackDuration()).toEqual(army.getUnitDuration(ArmyUnit.RAM));
        });
    });
})
