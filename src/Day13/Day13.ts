import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

class Day13 extends DaySolution {
  private readonly INPUT: string = "./Day13/resources/input-1.txt";

  runSolution1(): string {
    const program = IntcodeComputer.generateOpcodes(this.readFile(this.INPUT));
    const machine = new IntcodeComputer(program).executeNSteps(3);
    let continueRunning = true;
    let counter: number = 0;

    while (continueRunning) {
      const { done, value } = machine.next();
      continueRunning = !done;
      if (value[2] == 2) {
        counter++;
      }
    }

    return counter.toString();
  }

  runSolution2(): string {
    return "Not yet implemented";
  }
}

export default Day13;
