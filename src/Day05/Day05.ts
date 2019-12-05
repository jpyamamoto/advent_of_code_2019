import DaySolution from '../Utils/daySolution';

enum Opcodes {
  Add = 1,
  Multiply,
  Input,
  Output,
  JumpIfTrue,
  JumpIfFalse,
  LessThan,
  Equals,
  End = 99,
};

class Day05 extends DaySolution {
  private readonly INPUT: string = "./Day05/resources/input-1.txt";
  private USER_INPUT: number;

  private opcodes: number[];

  constructor() {
    super();
    this.USER_INPUT = 0;
    this.opcodes = [];
  }

  private generateOpcodes() {
    const input = this.readFile(this.INPUT);
    this.opcodes = this.parse(input);
  }

  private parse(content: string): number[] {
    const strings = content.split(',');
    const numbers = strings.map(num => Number.parseInt(num));
    return numbers;
  }

  private readFromPosition(position: number, mode: boolean): number {
    if (mode) {
      return this.opcodes[position];
    }

    return this.opcodes[this.opcodes[position]];
  }

  private writeToPosition(value: number, position: number, mode: boolean): void {
    if (mode) {
      this.opcodes[position] = value;
    } else {
      this.opcodes[this.opcodes[position]] = value;
    }
  }

  private handleAddition(position: number, modeFirst = false,
                         modeSecond = false, modeThird = false): number {
    const value1 = this.readFromPosition(position + 1, modeFirst);
    const value2 = this.readFromPosition(position + 2, modeSecond);
    this.writeToPosition(value1 + value2, position + 3, modeThird);
    return position + 4;
  }

  private handleMultiplication(position: number, modeFirst = false,
                               modeSecond = false, modeThird = false): number {
    const value1 = this.readFromPosition(position + 1, modeFirst);
    const value2 = this.readFromPosition(position + 2, modeSecond);
    this.writeToPosition(value1 * value2, position + 3, modeThird);
    return position + 4;
  }

  private handleInput(position: number, modeFirst = false): number {
    this.writeToPosition(this.USER_INPUT, position + 1, modeFirst);
    console.log(`Input : ${this.USER_INPUT}`);
    return position + 2;
  }

  private handleOutput(position: number, modeFirst = false): number {
    const out = this.readFromPosition(position + 1, modeFirst);
    console.log(`Output : ${out}`);
    return position + 2;
  }

  private handleJumpIfTrue(position: number, modeFirst = false,
                           modeSecond = false): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);

    return firstParam != 0 ?
      this.readFromPosition(position + 2, modeSecond) : position + 3;
  }

  private handleJumpIfFalse(position: number, modeFirst = false,
                            modeSecond = false): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);

    return firstParam == 0 ?
      this.readFromPosition(position + 2, modeSecond) : position + 3;
  }

  private handleLessThan(position: number, modeFirst = false,
                         modeSecond = false, modeThird = false): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);
    const secondParam = this.readFromPosition(position + 2, modeSecond);

    this.writeToPosition(firstParam < secondParam ? 1 : 0,
                         position + 3, modeThird);

    return position + 4;
  }

  private handleEquals(position: number, modeFirst = false,
                       modeSecond = false, modeThird = false): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);
    const secondParam = this.readFromPosition(position + 2, modeSecond);

    this.writeToPosition(firstParam == secondParam ? 1 : 0,
                         position + 3, modeThird);

    return position + 4;
  }

  private calculateOpcode(instruction: number): [number, boolean, boolean, boolean] {
    const opcode = instruction % 100;
    const modeFirst = Math.floor((instruction / 100) % 10) == 1 ? true : false;
    const modeSecond = Math.floor((instruction / 1000) % 10) == 1 ? true : false;
    const modeThird = Math.floor((instruction / 10000) % 10) == 1 ? true : false;

    return [opcode, modeFirst, modeSecond, modeThird];
  }

  private computeIntcode(): void {
    let position = 0;
    let [opcode, mode1, mode2, mode3] = this.calculateOpcode(this.opcodes[position]);

    while(opcode != Opcodes.End) {
      switch(opcode) {
        case Opcodes.Add:
          position = this.handleAddition(position, mode1, mode2, mode3);
          break;
        case Opcodes.Multiply:
          position = this.handleMultiplication(position, mode1, mode2, mode3);
          break;
        case Opcodes.Input:
          position = this.handleInput(position, mode1);
          break;
        case Opcodes.Output:
          position = this.handleOutput(position, mode1);
          break;
        case Opcodes.JumpIfTrue:
          position = this.handleJumpIfTrue(position, mode1, mode2);
          break;
        case Opcodes.JumpIfFalse:
          position = this.handleJumpIfFalse(position, mode1, mode2);
          break;
        case Opcodes.LessThan:
          position = this.handleLessThan(position, mode1, mode2, mode3);
          break;
        case Opcodes.Equals:
          position = this.handleEquals(position, mode1, mode2, mode3);
      }

      [opcode, mode1, mode2, mode3] = this.calculateOpcode(this.opcodes[position]);
    }
  }

  runSolution1(): string {
    this.generateOpcodes();
    this.USER_INPUT = 1;
    this.computeIntcode();

    return "Finished computing";
  }

  runSolution2(): string {
    this.generateOpcodes();
    this.USER_INPUT = 5;
    this.computeIntcode();

    return "Finished computing";
  }
}

export default Day05;
