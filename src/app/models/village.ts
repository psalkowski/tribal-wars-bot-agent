import { Coordinate, ICoordinate } from './coordinate.js';

export interface IVillage extends ICoordinate {
  id: number;
  name: string;
  owner: number;
  points: number;
  rank: number;
}

export class Village implements IVillage {
  id: number;
  name: string;
  owner: number;
  points: number;
  x: number;
  y: number;
  coordinate: Coordinate;
  rank: number;

  /**
   * @param id
   * @param text - Text from overview, pattern: <village_name> <coords> <continent>
   */
  constructor(id: number, text: string) {
    this.id = id;
    this.name = Village.parseName(text);
    this.coordinate = Coordinate.from(text);
  }

  private static parseName(text: string): string {
    const matched = text.match(/(.+)\((\d+\|\d+)\)/);

    if (matched && matched.length >= 1) {
      return matched[1].trim();
    }

    return null;
  }
}
