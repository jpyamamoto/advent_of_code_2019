enum Opcodes {
  Add = 1,
  Multiply,
  Input,
  Output,
  JumpIfTrue,
  JumpIfFalse,
  LessThan,
  Equals,
  AdjustBase,
  End = 99,
};

enum IOMode {
  Position = 0,
  Immediate = 1,
  Relative = 2,
};

class IntcodeComputer {
  private program: number[];
  private input: number[];
  private output: number|null;
  private relativeBase: number;

  constructor(program: number[], input: number[] = []) {
    this.program = [ ...program ];
    this.input = [ ...input ];
    this.output = null;
    this.relativeBase = 0;
  }

  static generateOpcodes(input: string): number[] {
    const strings = input.split(',');
    const numbers = strings.map(num => Number.parseInt(num));
    return numbers;
  }

  private readFromPosition(position: number, mode: IOMode): number {
    switch (mode) {
      case IOMode.Position:
        return this.program[this.program[position]] || 0;
      case IOMode.Immediate:
        return this.program[position] || 0;
      case IOMode.Relative:
        return this.program[this.program[position] + this.relativeBase] || 0;
    }
  }

  private writeToPosition(value: number, position: number, mode: IOMode): void {
    switch (mode) {
      case IOMode.Position:
        this.program[this.program[position]] = value;
        break;
      case IOMode.Immediate:
        this.program[position] = value;
        break;
      case IOMode.Relative:
        this.program[this.program[position] + this.relativeBase] = value;
        break;
    }
  }

  private handleAddition(position: number, modeFirst: IOMode,
                         modeSecond: IOMode, modeThird: IOMode): number {
    const value1 = this.readFromPosition(position + 1, modeFirst);
    const value2 = this.readFromPosition(position + 2, modeSecond);
    this.writeToPosition(value1 + value2, position + 3, modeThird);
    return position + 4;
  }

  private handleMultiplication(position: number, modeFirst: IOMode,
                               modeSecond: IOMode, modeThird: IOMode): number {
    const value1 = this.readFromPosition(position + 1, modeFirst);
    const value2 = this.readFromPosition(position + 2, modeSecond);
    this.writeToPosition(value1 * value2, position + 3, modeThird);
    return position + 4;
  }

  private handleInput(position: number, modeFirst: IOMode): number {
    this.writeToPosition((this.input.shift() as number), position + 1, modeFirst);
    return position + 2;
  }

  private handleOutput(position: number, modeFirst: IOMode): number {
    this.output = this.readFromPosition(position + 1, modeFirst);
    return position + 2;
  }

  private handleJumpIfTrue(position: number, modeFirst: IOMode,
                           modeSecond: IOMode): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);

    return firstParam != 0 ?
      this.readFromPosition(position + 2, modeSecond) : position + 3;
  }

  private handleJumpIfFalse(position: number, modeFirst: IOMode,
                            modeSecond: IOMode): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);

    return firstParam == 0 ?
      this.readFromPosition(position + 2, modeSecond) : position + 3;
  }

  private handleLessThan(position: number, modeFirst: IOMode,
                         modeSecond: IOMode, modeThird: IOMode): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);
    const secondParam = this.readFromPosition(position + 2, modeSecond);

    this.writeToPosition(firstParam < secondParam ? 1 : 0,
                         position + 3, modeThird);

    return position + 4;
  }

  private handleEquals(position: number, modeFirst: IOMode,
                       modeSecond: IOMode, modeThird: IOMode): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);
    const secondParam = this.readFromPosition(position + 2, modeSecond);

    this.writeToPosition(firstParam == secondParam ? 1 : 0,
                         position + 3, modeThird);

    return position + 4;
  }

  private handleAdjustBase(position: number, modeFirst: IOMode): number {
    const firstParam = this.readFromPosition(position + 1, modeFirst);

    this.relativeBase += firstParam;

    return position + 2;
  }

  private calculateOpcode(instruction: number): [number, IOMode, IOMode, IOMode] {
    const opcode = instruction % 100;
    const modeFirst = Math.floor((instruction / 100) % 10);
    const modeSecond = Math.floor((instruction / 1000) % 10);
    const modeThird = Math.floor((instruction / 10000) % 10);

    return [opcode, modeFirst, modeSecond, modeThird];
  }

  addToInput(input: number) {
    this.input.push(input);
  }

  *executeSteps(): Generator<number, number, undefined> {
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
          break;
        case Opcodes.AdjustBase:
          position = this.handleAdjustBase(position, mode1);
      }

      [opcode, mode1, mode2, mode3] = this.calculateOpcode(this.program[position]);
    }

    return (this.output as number);
  }

  *executeNSteps(n: number): Generator<number[], number[], unknown> {
    const generator = this.executeSteps();
    let continueRunning = true;

    while (continueRunning) {
      const outputs: number[] = [];

      for (let i = 0; i < n; i++) {
        let { done, value } = generator.next();
        outputs.push(value);
        continueRunning = !done;
      }

      yield outputs;
    }

    return [];
  }

  execute(): number {
    const generator = this.executeSteps();
    let continueRunning: boolean;

    do {
      let { done } = generator.next();
      continueRunning = !done;
    } while (continueRunning)

    return (this.output as number);
  }
}

export default IntcodeComputer;
