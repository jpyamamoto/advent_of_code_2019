import DaySolution from '../Utils/daySolution';
import Wire, { Coordinate } from './Wire';

class Day03 extends DaySolution {
  private readonly INPUT: string = "./Day03/resources/input-1.txt";

  private parse(lines: string): Wire[] {
    return lines.split('\n').map(line => new Wire(line));
  }

  private calculateOverlaps([wire1, wire2]: Wire[]): Coordinate[] {
    const overlaps: Coordinate[] = [];
    
    for (let coord of wire1.getCoordinates()) {
      if (wire2.hasCoordinate(coord)) {
        overlaps.push({
          ...coord,
          steps: coord.steps + wire2.stepsToCoordinate(coord)
        });
      }
    }

    return overlaps;
  }

  private manhattanDistance({ x, y }: Coordinate): number {
    return Math.abs(x) + Math.abs(y);
  }

  private getCloserCross(coords: Coordinate[]): Coordinate {
    return coords.reduce(
      (coord1, coord2) =>
        this.manhattanDistance(coord1) <= this.manhattanDistance(coord2) ?  coord1 : coord2
    );
  }

  private getLessStepsCross(coords: Coordinate[]): Coordinate {
    return coords.reduce(
      (coord1, coord2) => coord1.steps <= coord2.steps ? coord1 : coord2
    );
  }

  runSolution1(): string {
    const input = this.readFile(this.INPUT);
    const wires = this.parse(input);
    const overlaps = this.calculateOverlaps(wires);
    const closerCross = this.getCloserCross(overlaps);
    return this.manhattanDistance(closerCross).toString();
  }

  runSolution2(): string {
    const input = this.readFile(this.INPUT);
    const wires = this.parse(input);
    const overlaps = this.calculateOverlaps(wires);
    const closerCross = this.getLessStepsCross(overlaps);
    return closerCross.steps.toString();
  }
}

export default Day03;
