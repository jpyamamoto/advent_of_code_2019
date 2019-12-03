import DaySolution from '../Utils/daySolution';

class Day02 extends DaySolution {
  private readonly INPUT: string = "./Day02/resources/input-1.txt";
  private readonly OPCODE_ADD: number = 1;
  private readonly OPCODE_MUL: number = 2;
  private readonly OPCODE_END: number = 99;
  private readonly MIN_VAL: number = 0;
  private readonly MAX_VAL: number = 99;
  private readonly NOUN_POS: number = 1;
  private readonly VERB_POS: number = 2;
  private readonly OUTPUT_POS: number = 0;
  private readonly EXPECTED_OUTPUT_PART2: number = 19690720;

  private parse(content: string): number[] {
    const strings = content.split(',');
    const numbers = strings.map(num => Number.parseInt(num));
    return numbers;
  }

  private computeIntcode(opcodes: number[]): number[] {
    let position = 0;
    let temp: number;
    let currentOpcode = opcodes[position];

    while(currentOpcode != this.OPCODE_END) {
      switch(currentOpcode) {
        case this.OPCODE_ADD:
          temp = opcodes[opcodes[position+1]] + opcodes[opcodes[position+2]];
          break;
        case this.OPCODE_MUL:
          temp = opcodes[opcodes[position+1]] * opcodes[opcodes[position+2]];
          break;
        // Never reached, but the compiler complains otherwise.
        default:
          temp = 0;
      }

      opcodes[opcodes[position+3]] = temp;
      position += 4;
      currentOpcode = opcodes[position];
    }

    return opcodes;
  }

  private generatePairs(opcodes: number[]): number[] {
    for (let x = this.MIN_VAL; x <= this.MAX_VAL; x++) {
      for (let y = this.MIN_VAL; y <= this.MAX_VAL; y++) {
        const cloneOpcodes = [...opcodes];
        cloneOpcodes[this.NOUN_POS] = x;
        cloneOpcodes[this.VERB_POS] = y;
        const result = this.computeIntcode(cloneOpcodes);
        if (result[this.OUTPUT_POS] == this.EXPECTED_OUTPUT_PART2) {
          return cloneOpcodes;
        }
      }
    }

    // This point should never be reached.
    // But without the following line, the compiler complains.
    return [];
  }

  runSolution1(): string {
    const input = this.readFile(this.INPUT);
    const parsedInput = this.parse(input);

    // Instructions.
    // Before running the program:
    //  - Replace position 1 with the value 12.
    //  - Replace position 2 with the value 2.
    parsedInput[this.NOUN_POS] = 12;
    parsedInput[this.VERB_POS] = 2;

    const lastState = this.computeIntcode(parsedInput);

    return lastState[this.OUTPUT_POS].toString();
  }

  runSolution2(): string {
    const input = this.readFile(this.INPUT);
    const parsedInput = this.parse(input);
    const lastState = this.generatePairs(parsedInput);
    return `${(100 * lastState[this.NOUN_POS]) + lastState[this.VERB_POS]}`;
  }
}

export default Day02;
