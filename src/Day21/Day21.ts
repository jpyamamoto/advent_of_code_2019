import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

class Day21 extends DaySolution {
  private readonly INPUT: string = "./Day21/resources/input-1.txt";

  runSolution1(): string {
    const input: number[] = [
      'NOT A T',
      'NOT B J',
      'OR T J',
      'NOT C T',
      'OR T J',
      'AND D J',
      'WALK',
      ''].join('\n').split('').map(letter => letter.charCodeAt(0));

    let result: number = 0;
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    new IntcodeComputer(program,
      () => input.shift()!,
      (out) => {
        if (out > 'z'.charCodeAt(0)) {
          result = out;
        } else {
          process.stdout.write(String.fromCharCode(out));
        }
      }).execute();

    return result.toString();
  }

  runSolution2(): string {
    const input: number[] = [
      'OR E T',
      'OR H T',
      'AND D T',
      'OR A J',
      'AND B J',
      'AND C J',
      'NOT J J',
      'AND T J',
      'RUN',
      ''].join('\n').split('').map(letter => letter.charCodeAt(0));

    let result: number = 0;
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    new IntcodeComputer(program,
      () => input.shift()!,
      (out) => {
        if (out > 'z'.charCodeAt(0)) {
          result = out;
        } else {
          process.stdout.write(String.fromCharCode(out));
        }
      }).execute();

    return result.toString();
  }
}

export default Day21;
