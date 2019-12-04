import DaySolution from '../Utils/daySolution';

class Day04 extends DaySolution {
  private readonly INPUT_MIN: number = 284639;
  private readonly INPUT_MAX: number = 748759;

  private increasingDigits(num: string): boolean {
    const digits = num.split("").map(num => Number.parseInt(num));
    return digits.every((num, i, arr) => i == 0 ? true : arr[i-1] <= num);
  }

  private adjacentDoubleDigits(num: string): boolean {
    const digits = num.split("").map(num => Number.parseInt(num));
    return digits.some((num, i, arr) => arr[i-1] == num);
  }

  private bruteForceEvaluation(): number[] {
    const result: number[] = [];

    for (let num = this.INPUT_MIN; num <= this.INPUT_MAX; num++) {
      const numString = num.toString();
      if (this.increasingDigits(numString) && this.adjacentDoubleDigits(numString)) {
        result.push(num);
      }
    }

    return result;
  }

  runSolution1 (): string {
    const result = this.bruteForceEvaluation();
    return result.length.toString();
  }

  runSolution2 (): string {
    return "Not yet implemented.";
  }
}

export default Day04;
