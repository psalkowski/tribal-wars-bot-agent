import { Coordinate } from '../../../src/models/coordinate';
import moment from 'moment';

describe('Coordinate', () => {
    describe('from(text: string)', () => {
        test('should parse (123|456)', async () => {
            const coordinate = Coordinate.from('(123|456)');

            expect(coordinate.x).toBe(123);
            expect(coordinate.y).toBe(456);
        });

        test('should parse 123|456', async () => {
            const coordinate = Coordinate.from('123|456');

            expect(coordinate.x).toBe(123);
            expect(coordinate.y).toBe(456);
        });
    });

    const formatDuration = ms => {
        const days = Math.floor(ms / 8.64e7);
        const msOnLastDay = ms - days * 8.64e7;
        return (days < 10 ? "0" + days : days) + ":" + moment.utc(msOnLastDay).format("HH:mm:ss.SSS");
    };

    describe('distanceTo(target: Coordinate)', () => {
        test('should calculate distance', () => {
            const source = Coordinate.from('670|447');
            const distance = source.distanceTo(Coordinate.from('671|446'));
            const duration = moment.duration(distance * 10, 'minutes');

            expect(Math.round(duration.asSeconds())).toBe(849);
        });
    })
});
