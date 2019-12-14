import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

enum Tile {
  Empty = 0,
  Wall,
  Block,
  HPaddle,
  Ball,
};

interface coords {
  x: number,
  y: number,
};

class Day13 extends DaySolution {
  private readonly INPUT: string = "./Day13/resources/input-1.txt";
  private readonly FPS: number = 60;
  private boardWidth: number = 45;
  private boardHeight: number = 20;
  private board: Map<string, Tile> = new Map();
  private score: number = -1;
  private ball: coords = { x: 0, y: 0 };
  private hPaddle: coords = { x: 0, y: 0 };

  frame(): string {
    console.clear();
    let frame = `Score: ${this.score}`;

    for (let i = frame.length; i <= this.boardWidth; i++) {
      frame += " ";
    }

    for (let y = 0; y < this.boardHeight; y++) {
      frame += "\n";

      for (let x = 0; x < this.boardWidth; x++) {
        switch (this.board.get(`${x},${y}`)) {
          case Tile.Empty:
            frame += " ";
            break;
          case Tile.Wall:
            frame += "#";
            break;
          case Tile.Block:
            frame += "*";
            break;
          case Tile.HPaddle:
            frame += "-";
            break;
          case Tile.Ball:
            frame += "o";
            break;
          default:
            frame += " ";
        }
      }
    }

    return frame;
  }

  private moveJoystick(): number {
    if (this.ball.x > this.hPaddle.x) {
      return 1;
    }

    if (this.ball.x < this.hPaddle.x) {
      return -1;
    }

    return 0;
  }

  runSolution1(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program, [], () => 0).executeNSteps(3);
    let continueRunning = true;
    let counter: number = 0;

    while (continueRunning) {
      const { done, value } = machine.next();
      continueRunning = !done;
      if (value[2] == Tile.Block) {
        counter++;
      }
    }

    return counter.toString();
  }

  runSolution2(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    program[0] = 2;
    const machine = new IntcodeComputer(program, [], () => this.moveJoystick());
    const steps = machine.executeNSteps(3);
    let continueRunning = true;

    setInterval(() => {
      if (continueRunning) {
        const { value, done } = steps.next();
        continueRunning = !done;

        if (value[0] == -1 && value[1] == 0) {
          this.score = value[2];
          return;
        }

        if (value[2] == Tile.Ball) {
          this.ball = { x: value[0], y: value[1] };
        }

        if (value[2] == Tile.HPaddle) {
          this.hPaddle = { x: value[0], y: value[1] };
        }

        this.board.set(`${value[0]},${value[1]}`, value[2]);
        console.log(this.frame());
      }
    }, 1000/this.FPS);

    return "Not yet implemented";
  }
}

export default Day13;
