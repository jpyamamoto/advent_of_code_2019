import DaySolution from '../Utils/daySolution';

class Day16 extends DaySolution {
  private readonly INPUT: string = "./Day16/resources/input-1.txt";
  private readonly PATTERN: number[] = [0, 1, 0, -1];

  private parse(input: string) {
    return input.split('').map(num => Number.parseInt(num));
  }

  private getPattern(index: number, repetitions: number): number {
    return this.PATTERN[Math.floor(((index + 1) % (4 * repetitions)) / repetitions)];
  }

  private nextPhase(data: number[]): void {
    for (let i = 0; i < data.length; i++) {
      let result = 0;
      for (let j = 0; j < data.length; j++) {
        result += data[j] * this.getPattern(j, i + 1);
      }
      data[i] = Math.abs(result) % 10;
    }
  }

  private nextPhaseOptimization(data: number[]): void {
    let lastVal = 0;

    for (let i = data.length - 1; i >= 0; i--) {
      lastVal = data[i] + lastVal;
      data[i] = lastVal % 10
    }
  }

  runSolution1(): string {
    const input = this.parse(this.readFile(this.INPUT));
    let data = [...input];

    for (let i = 0; i < 100; i++) {
      this.nextPhase(data);
    }

    return data.slice(0, 8).join('');
  }

  runSolution2(): string {
    const input = this.parse(this.readFile(this.INPUT));
    let data: number[] = new Array(10000).fill(input).flat();
    const offset = Number.parseInt(data.slice(0, 7).join(''));

    for (let i = 0; i < 100; i++) {
      this.nextPhaseOptimization(data);
    }

    return data.slice(offset, offset + 8).join('');
  }
}

export default Day16;
