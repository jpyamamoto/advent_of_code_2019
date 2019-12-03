export type Coordinate = [number, number];

class Wire {
  private coordinates: Coordinate[];

  constructor(line: string) {
    const instructions = line.split(',');
    this.coordinates = this.buildCoords(instructions);
  }

  private buildCoords(instructions: string[]): Coordinate[] {
    let posX = 0, posY = 0;
    const coords: Coordinate[] = [];

    for (let move of instructions) {
      let direction = move[0];
      let steps = Number.parseInt(move.slice(1));

      while (steps > 0) {
        switch(direction) {
          case 'U':
            posY++;
            break;
          case 'D':
            posY--;
            break;
          case 'R':
            posX++;
            break;
          case 'L':
          default: // There are no more options, but the compiler doesn't know.
            posX--;
            break;

        }

        coords.push([posX, posY]);
        steps--;
      }
    }

    return coords;
  }

  getCoordinates(): Coordinate[] {
    return [...this.coordinates];
  }

  hasCoordinate([x, y]: Coordinate): boolean {
    return this.coordinates.some(([posX, posY]) => posX == x && posY == y);
  }
}

export default Wire;
