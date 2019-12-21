import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

class Day19 extends DaySolution {
  private readonly INPUT: string = "./Day19/resources/input-1.txt";

  runSolution1(): string {
    const size = 50;
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));

    let result = 0;
    const input: number[] = [];
    const machine = new IntcodeComputer(program,
      () => input.shift()!,
      (out: number) => result += out
    );

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        input.push(y);
        input.push(x);
        machine.execute();
        machine.reboot();
      }
    }

    return result.toString();
  }

  runSolution2(): string {
    const size = 100;
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));

    let output: number = 0;
    const input: number[] = [];
    const machine = new IntcodeComputer(program,
      () => input.shift()!,
      (out: number) => output = out
    );

    const check = (x: number, y: number): number => {
      input.push(x);
      input.push(y);
      machine.execute();
      machine.reboot();
      return output;
    }

    // Starting point selected manually.
    let x = 82, y = 100;
    let flag = false;
    while (true) {
      if (check(x, y)) {
        flag = false;
        if (check(x + size - 1, y - size + 1) && check(x, y - size + 1)) {
          break;
        }
      }

      if (flag) {
        x++;
      } else {
        y++;
        flag = true;
      }
    }

    return ((x * 10000) + y - size + 1).toString();
  }
}

export default Day19;
