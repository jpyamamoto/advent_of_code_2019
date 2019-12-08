import DaySolution from '../Utils/daySolution';
import IntcodeComputer from './IntcodeComputer';

class Day07 extends DaySolution {
  private readonly INPUT: string = "./Day07/resources/input-1.txt";

  private generateOpcodes(file: string): number[] {
    const input = this.readFile(file);
    return this.parse(input);
  }

  private parse(content: string): number[] {
    const strings = content.split(',');
    const numbers = strings.map(num => Number.parseInt(num));
    return numbers;
  }

  /* Using Heap's algorithm. */
  private generatePermutations(elements: number[]): number[][] {
    let result = [];

    for (let i = 0; i < elements.length; i++) {
      let temp = this.generatePermutations(
                        elements.slice(0, i).concat(elements.slice(i + 1)));

      if(!temp.length) {
        result.push([elements[i]])
      } else {
        for(let j = 0; j < temp.length; j++) {
          result.push([elements[i]].concat(temp[j]))
        }
      }
    }
    return result;
  }

  runSolution1(): string {
    const program = this.generateOpcodes(this.INPUT);
    const permutations = this.generatePermutations([0,1,2,3,4]);
    let highestSignal = 0;

    for (let phase of permutations) {
      const ampAOutput = new IntcodeComputer(program, [phase[0], 0]).execute().next().value;
      const ampBOutput = new IntcodeComputer(program, [phase[1], ampAOutput]).execute().next().value;
      const ampCOutput = new IntcodeComputer(program, [phase[2], ampBOutput]).execute().next().value;
      const ampDOutput = new IntcodeComputer(program, [phase[3], ampCOutput]).execute().next().value;
      const ampEOutput = new IntcodeComputer(program, [phase[4], ampDOutput]).execute().next().value;

      highestSignal = highestSignal < ampEOutput ? ampEOutput : highestSignal;
    }

    return highestSignal.toString();
  }

  runSolution2(): string {
    const program = this.generateOpcodes(this.INPUT);
    const permutations = this.generatePermutations([5,6,7,8,9]);
    let highestSignal = 0;

    for (let phase of permutations) {
      let finished = false;

      const ampA = new IntcodeComputer(program, [phase[0], 0]);
      const ampB = new IntcodeComputer(program, [phase[1]]);
      const ampC = new IntcodeComputer(program, [phase[2]]);
      const ampD = new IntcodeComputer(program, [phase[3]]);
      const ampE = new IntcodeComputer(program, [phase[4]]);

      const ampAOutputGen = ampA.execute();
      const ampBOutputGen = ampB.execute();
      const ampCOutputGen = ampC.execute();
      const ampDOutputGen = ampD.execute();
      const ampEOutputGen = ampE.execute();

      let ampAOutput, ampBOutput, ampCOutput, ampDOutput, ampEOutput = 0;

      while (!finished) {
        ampAOutput = ampAOutputGen.next().value;
        ampB.addToInput(ampAOutput);

        ampBOutput = ampBOutputGen.next().value;
        ampC.addToInput(ampBOutput);

        ampCOutput = ampCOutputGen.next().value;
        ampD.addToInput(ampCOutput);

        ampDOutput = ampDOutputGen.next().value;
        ampE.addToInput(ampDOutput);

        let { value, done } = ampEOutputGen.next();
        ampEOutput = value;
        ampA.addToInput(ampEOutput);

        finished = done != undefined && done;
      }

      highestSignal = highestSignal < ampEOutput ? ampEOutput : highestSignal;
    }


    return highestSignal.toString();
  }
}

export default Day07;
