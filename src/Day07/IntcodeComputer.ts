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

class IntcodeComputer {
  private program: number[];
  private input: number[];
  private output: number|null;

  constructor(program: number[], input: number[]) {
    this.program = [ ...program ];
    this.input = [ ...input ];
    this.output = null;
  }

  private readFromPosition(position: number, mode: boolean): number {
    if (mode) {
      return this.program[position];
    }

    return this.program[this.program[position]];
  }

  private writeToPosition(value: number, position: number, mode: boolean): void {
    if (mode) {
      this.program[position] = value;
    } else {
      this.program[this.program[position]] = value;
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
    this.writeToPosition((this.input.shift() as number), position + 1, modeFirst);
    return position + 2;
  }

  private handleOutput(position: number, modeFirst = false): number {
    this.output = this.readFromPosition(position + 1, modeFirst);
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

  addToInput(input: number) {
    this.input.push(input);
  }

  *execute(): Generator<number, number, number> {
    let position = 0;
    let [opcode, mode1, mode2, mode3] = this.calculateOpcode(this.program[position]);

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
          yield (this.output as number);
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

      [opcode, mode1, mode2, mode3] = this.calculateOpcode(this.program[position]);
    }

    return (this.output as number);
  }
}

export default IntcodeComputer;
