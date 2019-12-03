export interface Coordinate {
  x: number,
  y: number,
  steps: number
};

class Wire {
  private coordinates: Coordinate[];

  constructor(line: string) {
    const instructions = line.split(',');
    this.coordinates = this.buildCoords(instructions);
  }

  private buildCoords(instructions: string[]): Coordinate[] {
    let posX = 0, posY = 0, totalSteps = 0;
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

        coords.push({ x: posX, y: posY, steps: ++totalSteps });
        steps--;
      }
    }

    return coords;
  }

  getCoordinates(): Coordinate[] {
    return [...this.coordinates];
  }

  hasCoordinate({x, y}: Coordinate): boolean {
    return this.coordinates.some(({x: posX, y: posY}) => posX == x && posY == y);
  }

  stepsToCoordinate({x, y}: Coordinate): number {
    return this.coordinates
      .filter(({x: posX, y: posY}) => posX == x && posY == y)
      .reduce((acc, coord) => acc.steps <= coord.steps ? acc : coord)
      .steps;
  }
}

export default Wire;
