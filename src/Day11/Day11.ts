import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

enum Color {
  BLACK = 0,
  WHITE = 1,
};

enum Direction {
  Up,
  Down,
  Left,
  Right,
};

enum Movement {
  Left = 0,
  Right = 1,
};

class Day11 extends DaySolution {
  private readonly INPUT: string = "./Day11/resources/input-1.txt";

  private changeDirection(currDirection: Direction, movement: Movement): Direction {
    switch (currDirection) {
      case Direction.Up:    return movement ? Direction.Left : Direction.Right;
      case Direction.Down:  return movement ? Direction.Right : Direction.Left;
      case Direction.Left:  return movement ? Direction.Down : Direction.Up;
      case Direction.Right: return movement ? Direction.Up: Direction.Down;
    }
  }

  private changePosition([x, y]: [number, number], direction: Direction): [number, number] {
    switch(direction) {
      case Direction.Up:    return [x, y + 1];
      case Direction.Down:  return [x, y - 1];
      case Direction.Left:  return [x - 1, y];
      case Direction.Right: return [x + 1, y];
    }
  }

  private performStep(position: [number, number], direction: Direction,
                         movement: Movement): [Direction, [number, number]] {

    let newDirection = this.changeDirection(direction, movement);
    let newPosition = this.changePosition(position, newDirection);

    return [newDirection, newPosition];
  }

  private paintTile([x, y]: [number, number], color: Color, tiles: Map<string, Color>) {
    tiles.set(`${x},${y}`, color);
  }

  private getColor([x, y]: [number, number], tiles: Map<string, Color>): Color {
    return tiles.get(`${x},${y}`) || Color.BLACK;
  }

  private controlRobot(computer: IntcodeComputer, tiles: Map<string, Color>): Map<string, Color> {
    let continueExecution = true;
    let direction: Direction = Direction.Up;
    let position: [number, number] = [0, 0];
    let steps = computer.executeSteps();
    computer.addToInput(this.getColor(position, tiles));

    while (continueExecution) {
      const newColor = steps.next().value;
      const { value: movement, done } = steps.next();
      this.paintTile(position, newColor, tiles);

      [direction, position] = this.performStep(position, direction, movement);
      computer.addToInput(this.getColor(position, tiles));
      continueExecution = !done;
    }

    return tiles;
  }

  private getExtremes(tiles: Map<string, Color>): [number, number, number, number] {
    let leftmost = 0;
    let rightmost = 0;
    let lowest = 0;
    let highest = 0;

    for (let [position, ] of tiles) {
      const [x, y] = position.split(',').map(num => Number.parseInt(num));

      if (x < leftmost) {
        leftmost = x;
      }

      if (x > rightmost) {
        rightmost = x;
      }

      if (y < lowest) {
        lowest = y;
      }

      if (y > highest) {
        highest = y;
      }
    }

    return [leftmost, rightmost, lowest, highest]
  }

  private printableImage(tiles: Map<string, Color>): string {
    const [leftmost, rightmost, lowest, highest] = this.getExtremes(tiles);
    let result = "\n";

    for (let y = highest; y >= lowest; y--) {
      for (let x = rightmost; x >= leftmost; x--) {
        result += tiles.get(`${x},${y}`) == Color.BLACK ? " " : "█";
      }

      result += "\n";
    }

    return result;
  }

  runSolution1(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program);
    const tiles: Map<string, Color> = new Map();
    const result = this.controlRobot(machine, tiles);

    return result.size.toString();
  }

  runSolution2(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program);
    const tiles: Map<string, Color> = new Map();
    tiles.set('0,0', Color.WHITE);
    const imageInfo = this.controlRobot(machine, tiles);
    const image = this.printableImage(imageInfo);

    return image;
  }
}

export default Day11;
