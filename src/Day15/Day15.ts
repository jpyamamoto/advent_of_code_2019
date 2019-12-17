import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

interface IRobotInfo {
  x: number,
  y: number,
  direction: Direction,
  end: boolean,
};

enum Direction {
  North = 1,
  South = 2,
  West  = 3,
  East  = 4,
};

enum Status {
  Wall = 0,
  Moved = 1,
  Oxygen = 2,
};

class Day15 extends DaySolution {
  private readonly INPUT: string = "./Day15/resources/input-1.txt";
  private paths: Set<string>;
  private robotInfo: IRobotInfo;
  private oxygenSystem: string;

  constructor() {
    super();
    this.paths = new Set();
    this.robotInfo = { x: 0, y: 0, direction: Direction.North, end: false };
    this.oxygenSystem = '';
  }

  private moveRight(direction: Direction): Direction {
    switch (direction) {
      case Direction.North: return Direction.East;
      case Direction.East:  return Direction.South;
      case Direction.South: return Direction.West;
      case Direction.West:  return Direction.North;
    };
  }

  private moveLeft(direction: Direction): Direction {
    switch (direction) {
      case Direction.North: return Direction.West;
      case Direction.West:  return Direction.South;
      case Direction.South: return Direction.East;
      case Direction.East:  return Direction.North;
    };
  }

  private movedTo(): void {
    switch (this.robotInfo.direction) {
      case Direction.North:
        this.robotInfo.y--;
        break;
      case Direction.South:
        this.robotInfo.y++;
        break;
      case Direction.West:
        this.robotInfo.x--;
        break;
      case Direction.East:
        this.robotInfo.x++;
    }
  }

  private handleMovement = (stopExecution: () => void) => {
    if (this.robotInfo.end) {
      stopExecution();
    }

    return this.robotInfo.direction;
  }

  private handleOutput = (status: Status) => {
    if (status != Status.Wall) {
      this.movedTo();
    }
    const { x, y, direction } = this.robotInfo;

    if (status == Status.Oxygen) {
      this.oxygenSystem = `${x},${y}`;
    }


    if (status == Status.Wall) {
      this.robotInfo.direction = this.moveLeft(direction);
    } else {
      this.paths.add(`${x},${y}`);
      this.robotInfo.direction = this.moveRight(direction);
    }

    if (x == 0 && y == 0 && status == Status.Moved) {
      this.robotInfo.end = true;
    }
  }

  private getNeighbours(path: string): string[] {
    const [x, y] = path.split(',').map(num => Number.parseInt(num));
    const neighbours: string[] = [];

    this.paths.has(`${x + 1},${y}`) && neighbours.push(`${x + 1},${y}`);
    this.paths.has(`${x - 1},${y}`) && neighbours.push(`${x - 1},${y}`);
    this.paths.has(`${x},${y + 1}`) && neighbours.push(`${x},${y + 1}`);
    this.paths.has(`${x},${y - 1}`) && neighbours.push(`${x},${y - 1}`);

    return neighbours;
  }

  private distanceBetween(origin: string, target: string): number {
    let queue: string[] = [];
    let current = origin;
    let distance = 0;

    const pathsVisited: Map<string, { visited: boolean, distance: number }> = new Map();
    this.paths.forEach(path => pathsVisited.set(path, { visited: false, distance: 0 }));

    pathsVisited.set(current, { visited: true, distance: distance });
    queue.push(current);

    while (queue.length != 0) {
      current = queue.shift()!;
      distance = pathsVisited.get(current)!.distance;

      for (let neighbour of this.getNeighbours(current)) {
        if (!pathsVisited.get(neighbour)!.visited) {
          pathsVisited.set(neighbour, { visited: true, distance: distance + 1 });
          queue.push(neighbour);

          if (neighbour == target) {
            return distance + 1;
          }
        }
      }
    }

    // Should only be reached when the target is non-existent, in
    // which case it will return the distance of the farthest point.
    return pathsVisited.get(current)!.distance;
  }

  runSolution1(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program, this.handleMovement, this.handleOutput);
    machine.execute();

    return this.distanceBetween('0,0', this.oxygenSystem).toString();
  }

  runSolution2(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program, this.handleMovement, this.handleOutput);
    machine.execute();

    return this.distanceBetween(this.oxygenSystem, '').toString();
  }
}

export default Day15;
