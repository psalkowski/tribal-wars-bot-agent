export interface ICoordinate {
  x: number;
  y: number;
}

export class Coordinate implements ICoordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static from(text: string): Coordinate {
    const matched = text.match(/\(?(\d+\|\d+)\)?/);

    if (matched && matched.length >= 1) {
      const coords = matched[1];
      const [x, y] = coords.split('|').map(Number);

      return new Coordinate(x, y);
    }

    return null;
  }

  distanceTo(target: Coordinate): number {
    return Math.sqrt(
      Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2),
    );
  }

  toString(): string {
    return `${this.x}|${this.y}`;
  }
}
