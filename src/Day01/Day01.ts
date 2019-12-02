import DaySolution from '../Utils/daySolution';

class Day01 extends DaySolution {
  private readonly DIVISOR: number = 3;
  private readonly INPUT1: string = "./Day01/resources/input-1.txt";

  private parse(content: string): number[] {
    const strings = content.split('\n');
    const numbers = strings.map(num => Number.parseInt(num));
    return numbers;
  }

  private operation = (num: number): number => {
    const temp = Math.floor(num / this.DIVISOR);
    return temp > 0 ? temp : 0;
  }

  private process = (numbers: number[]): number => {
    let result = 0;

    for (let num of numbers) {
      result += this.operation(num);
    }

    return result;
  }

  private processNested = (numbers: number[]): number => {
    let result = 0;

    for (let num of numbers) {
      let sumNum = 0;
      let temp = num;

      do {
        temp = Math.floor(temp / this.DIVISOR) - 2;
        sumNum += temp > 0 ? temp : 0;
      } while (temp > 0);

      result += sumNum;
    }

    return result;
  }

  runSolution1 (): string {
    const input = this.readFile(this.INPUT1);
    const parsedInput = this.parse(input);
    const result = this.process(parsedInput);
    return result.toString();
  }

  runSolution2 (): string {
    const input = this.readFile(this.INPUT1);
    const parsedInput = this.parse(input);
    const result = this.processNested(parsedInput);
    return result.toString();
  }
}

export default Day01;
