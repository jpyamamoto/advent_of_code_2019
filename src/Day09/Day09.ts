import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

class Day09 extends DaySolution {
  private readonly INPUT: string = "./Day09/resources/input-1.txt";

  runSolution1(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program, [1]);
    const result = machine.execute();

    return result.toString();
  }

  runSolution2(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program, [2]);
    const result = machine.execute();

    return result.toString();
  }
}

export default Day09;
