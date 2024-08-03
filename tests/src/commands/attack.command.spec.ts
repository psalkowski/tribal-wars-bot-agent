import moment from 'moment';
import { AttackCommand } from '../../../src/commands/attack.command';
import { ArmyUnit } from '../../../src/constants/army';
import { AttackType } from '../../../config/pl156';


describe('AttackCommand', () => {
    describe('constructor()', () => {
        test('should parse payload', () => {
            const command = new AttackCommand({
                type: AttackType.ATTACK,
                target: '671|446',
                army: { [ArmyUnit.SWORD]: 2 },
                arriveAt: '29.08.2020 21:55:00.100',
            });

            expect(command.source).toEqual({x: 670, y: 447});
            expect(command.target).toEqual({x: 671, y: 446});
            expect(command.arriveAt).toEqual(moment('29.08.2020 21:55:00.100', 'DD.MM.YYYY HH:mm:ss.SSS').valueOf());
            expect(command.runAt).toEqual(command.arriveAt - command.getDistanceDuration());
            expect(command.army?.squad).toBeDefined();
            expect(command.army.squad).toEqual({
                [ArmyUnit.SPEAR]: 0,
                [ArmyUnit.SWORD]: 2,
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
            });
        })
    });
});

