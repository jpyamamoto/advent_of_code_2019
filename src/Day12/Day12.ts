import DaySolution from '../Utils/daySolution';
import Moon from './Moon';

class Day12 extends DaySolution {
  private readonly INPUT: string = "./Day12/resources/input-1.txt";
  private readonly STEPS: number = 1000;

  private parse(input: string): Moon[] {
    const moons: Moon[] = [];
    const lines = input.split('\n');

    for (let line of lines) {
      const clean = line.replace(/[^0-9,-]/g, "");
      const [x, y, z] = clean.split(',').map(num => Number.parseInt(num));
      moons.push(new Moon(x, y, z));
    }

    return moons;
  }

  private greatestCommonDivisor(a: number, b: number): number {
    while (a != b) {
      if (a > b) {
        a -= b;
      } else {
        b -= a;
      }
    }

    return a;
  }

  private leastCommonMultiple(a: number, b: number): number {
    return (a * b) / this.greatestCommonDivisor(a, b);
  }

  runSolution1(): string {
    const moons = this.parse(this.readFile(this.INPUT));

    for (let i = 0; i < this.STEPS; i++) {
      for (let moon of moons) {
        moon.changeVelocity(moons);
      }

      for (let moon of moons) {
        moon.changePosition();
      }
    }

    let result = 0;
    for (let moon of moons) {
      result += moon.getKineticEnergy() * moon.getPotentialEnergy();
    }

    return result.toString();
  }

  runSolution2(): string {
    const moons = this.parse(this.readFile(this.INPUT));
    let i = 0;
    let cycleX, cycleY, cycleZ;

    do {
      for (let moon of moons) {
        moon.changeVelocity(moons);
      }

      for (let moon of moons) {
        moon.changePosition();
      }

      i++;

      if (cycleX == undefined && moons.every(moon => moon.sameAsOriginalX())) {
        cycleX = i;
      };

      if (cycleY == undefined && moons.every(moon => moon.sameAsOriginalY())) {
        cycleY = i;
      };

      if (cycleZ == undefined && moons.every(moon => moon.sameAsOriginalZ())) {
        cycleZ = i;
      };
    } while(cycleX == undefined || cycleY == undefined || cycleZ == undefined);

    const lcmXY = this.leastCommonMultiple(cycleX, cycleY);
    const lcmXYZ = this.leastCommonMultiple(lcmXY, cycleZ);

    return lcmXYZ.toString();
  }
}

export default Day12;
