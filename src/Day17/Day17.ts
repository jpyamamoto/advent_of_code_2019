import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

interface Tile {
  x: number,
  y: number,
  char: number,
};

enum Direction {
  Up = 94,
  Down = 86,
  Left = 60,
  Right = 62,
};

enum Turn {
  Left = 76,
  Right = 82,
};

interface IRobotInfo {
  x: number,
  y: number,
  direction: Direction,
};

class Day17 extends DaySolution {
  private readonly INPUT: string = "./Day17/resources/input-1.txt";
  private readonly SPACE: number = '.'.charCodeAt(0);
  private FUNCTIONS: {[key: string]: string} = {
    'A': 'R,10,L,10,L,12,R,6',
    'B': 'L,10,R,12,R,12',
    'C': 'R,6,R,10,L,10',
  };
  private map: Map<string, Tile> = new Map();
  private width: number = 0;
  private height: number = 0;
  private handlerIndex = 0;
  private robotInfo: IRobotInfo = { x: 0, y: 0, direction: Direction.Up };

  private generateMap = (): (char: number) => void => {
    let x = 0, y = 0;
    let lastChar = 0;

    return (character: number) => {
      switch (character) {
        case 10:
          x = 0;
          y++;
          break;
        case Direction.Up:
        case Direction.Down:
        case Direction.Left:
        case Direction.Right:
          this.robotInfo = { x: x, y: y, direction: character };
        default:
          this.map.set(`${x},${y}`, { x: x, y: y, char: character });
          this.width = x++;
          this.height = y;
      }

      if (lastChar == 10 && character == 10) {
        this.handlerIndex++;
      }
      lastChar = character;
    };
  }

  private isIntersection(x: number, y: number) {
    return this.map.get(`${x-1},${y}`)!.char != this.SPACE &&
           this.map.get(`${x+1},${y}`)!.char != this.SPACE &&
           this.map.get(`${x},${y-1}`)!.char != this.SPACE &&
           this.map.get(`${x},${y+1}`)!.char != this.SPACE;
  }

  private findIntersections(): Tile[] {
    const tiles: Tile[] = [];

    for (let y = 1; y < this.height; y++) {
      for (let x = 1; x < this.width; x++) {
        const elem = this.map.get(`${x},${y}`);
        if (elem != undefined && elem.char != this.SPACE) {
          if (this.isIntersection(x, y)) {
            tiles.push(elem);
          }
        }
      }
    }

    return tiles;
  }

  private changeDirection(x: number, y: number, direction: Direction): [Direction, Turn] {
    let elem;
    switch (direction) {
      case Direction.Up:
        elem = this.map.get(`${x-1},${y}`);
        if (elem != undefined && elem.char != this.SPACE) {
          return [Direction.Left, Turn.Left];
        }
        return [Direction.Right, Turn.Right];
      case Direction.Down:
        elem = this.map.get(`${x-1},${y}`);
        if (elem != undefined && elem.char != this.SPACE) {
          return [Direction.Left, Turn.Right];
        }
        return [Direction.Right, Turn.Left];
      case Direction.Left:
        elem = this.map.get(`${x},${y-1}`);
        if (elem != undefined && elem.char != this.SPACE) {
          return [Direction.Up, Turn.Right];
        }
        return [Direction.Down, Turn.Left];
      case Direction.Right:
        elem = this.map.get(`${x},${y+1}`);
        if (elem != undefined && elem.char != this.SPACE) {
          return [Direction.Down, Turn.Right];
        }
        return [Direction.Up, Turn.Left];
    }
  }

  private countStepsAhead(x: number, y: number, direction: Direction): number {
    let counter = 0;
    let tile;

    do {
      counter++;
      switch (direction) {
        case Direction.Up:
          tile = this.map.get(`${x},${y - counter}`);
          break;
        case Direction.Down:
          tile = this.map.get(`${x},${y + counter}`);
          break;
        case Direction.Left:
          tile = this.map.get(`${x - counter},${y}`);
          break;
        case Direction.Right:
          tile = this.map.get(`${x + counter},${y}`);
          break;
      }
    } while (tile != undefined && tile.char != this.SPACE);

    return counter - 1;
  }

  private generatePath(): string {
    let result: string[] = [];
    let { x, y, direction } = this.robotInfo;
    let turn: Turn;

    while (true) {
      [direction, turn] = this.changeDirection(x, y, direction);
      let steps = this.countStepsAhead(x, y, direction);

      if (steps == 0) {
        break;
      }

      switch (direction) {
        case Direction.Up:
          y -= steps;
          break;
        case Direction.Down:
          y += steps;
          break;
        case Direction.Left:
          x -= steps;
          break;
        case Direction.Right:
          x += steps;
      }

      result.push(String.fromCharCode(turn));
      result.push(steps.toString());
    }

    return result.join(',');
  }

  private compressPath(path: string): string {
    let result = path;

    for (let [key, value] of Object.entries(this.FUNCTIONS)) {
      result = result.split(value).join(key);
    }

    return result;
  }

  private logger(char: number): void {
    process.stdout.write(String.fromCharCode(char));
  }

  runSolution1(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    new IntcodeComputer(program, () => 0, this.generateMap()).execute();

    const intersections = this.findIntersections();

    let result = 0;
    for (let { x, y } of intersections) {
      result += x * y;
    }

    return result.toString();
  }

  runSolution2(): string {
    this.map = new Map();
    this.width = 0, this.height = 0, this.handlerIndex = 0;

    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    program[0] = 2;

    // Inputs.
    let inputs: number[] = [];
    const handleInput = (): number => {
      if (inputs.length == 0) {
        const path = this.generatePath();
        const main = this.compressPath(path);
        let input = "";

        input += main + "\n";
        input += this.FUNCTIONS['A'] + "\n";
        input += this.FUNCTIONS['B'] + "\n";
        input += this.FUNCTIONS['C'] + "\n";
        input += "n\n";
        inputs = input.split("").map(char => char.charCodeAt(0));
      }

      if (inputs.length == 1) {
        this.handlerIndex++;
      }

      const nextInput = inputs.shift();
      this.logger(nextInput!);

      return nextInput!;
    }

    // Outputs.
    let result: number = 0;
    const setResult = (out: number) => {
      result = out;
    }
    const handlersOutput = [this.generateMap(), this.logger, this.generateMap(),
                            setResult];
    const handleOutput = (char: number) => {
      return handlersOutput[this.handlerIndex](char);
    }
    new IntcodeComputer(program, handleInput, handleOutput).execute();

    return result.toString();
  }
}

export default Day17;
