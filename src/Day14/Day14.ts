import DaySolution from '../Utils/daySolution';
import Chemical from './Chemical';

class Day14 extends DaySolution {
  private readonly INPUT: string = "./Day14/resources/input-1.txt";
  private readonly AVAILABLE_ORE: number = 1000000000000;

  private parse(input: string) {
    new Chemical("1 ORE", "");
    input.split('\n').map(line => {
      const [dependencies, chemical] = line.split('=>');
      new Chemical(chemical, dependencies);
    })
  }

  runSolution1(): string {
    this.parse(this.readFile(this.INPUT));
    //this.parse(this.readFile('./Day14/resources/input-test-1.txt'));
    Chemical.produce(1, "FUEL");

    return Chemical.totalProduced("ORE").toString();
  }

  runSolution2(): string {
    this.parse(this.readFile(this.INPUT));
    let lower = 1;
    let upper = this.AVAILABLE_ORE;

    while (true) {
      const pivot = Math.floor((upper - lower) / 2) + lower;
      Chemical.produce(pivot, "FUEL");
      const totalOres = Chemical.totalProduced("ORE");

      if (upper - lower <= 1) {
        break;
      }

      if (totalOres > this.AVAILABLE_ORE) {
        upper = pivot;
      } else {
        lower = pivot;
      }
    }

    return Chemical.totalProduced("FUEL").toString();
  }
}

export default Day14;
