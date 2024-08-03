import { Coordinate } from '../../../src/models/coordinate.js';
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

  describe('distanceTo(target: Coordinate)', () => {
    test('should calculate distance', () => {
      const source = Coordinate.from('670|447');
      const distance = source.distanceTo(Coordinate.from('671|446'));
      const duration = moment.duration(distance * 10, 'minutes');

      expect(Math.round(duration.asSeconds())).toBe(849);
    });
  });
});
