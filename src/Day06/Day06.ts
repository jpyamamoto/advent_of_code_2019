import daySolution from '../Utils/daySolution';

interface Planets {
  [name: string] : number
}

class Day06 extends daySolution {
  private readonly INPUT: string = "./Day06/resources/input-1.txt";
  private planets: Planets = {};
  private numPlanets: number = 0;

  format(input: string): string[][] {
    const orbits = input.split('\n');
    return orbits.map(orbit => orbit.split(')'));
  }

  parsePlanets(orbits: string[][]): void {
    const planets = orbits.reduce((acc, orbit) => acc.concat(orbit));
    const planetsSet = new Set(planets);
    for (let planet of planetsSet) {
      this.planets[planet] = this.numPlanets++;
    }
  }

  getIdOfPlanet(name: string): number {
    return this.planets[name];
  }

  generateSquareMatrix(size: number): boolean[][] {
    return new Array(size).fill(null).map(() => Array(size).fill(false));
  }

  fillMatrix(orbits: string[][]): boolean[][] {
    const newMatrix = this.generateSquareMatrix(this.numPlanets);

    for (let orbit of orbits) {
      newMatrix[this.getIdOfPlanet(orbit[0])][this.getIdOfPlanet(orbit[1])] = true;
    }

    return newMatrix;
  }

  warshall(matrix: boolean[][]): boolean[][] {
    let temp = this.generateSquareMatrix(this.numPlanets);

    for (let i = 0; i < this.numPlanets; i++) {
      for (let j = 0; j < this.numPlanets; j++) {
        temp[i][j] = matrix[i][j];
      }
    }

    for (let m = 0; m < this.numPlanets; m++) {
      for (let n = 0; n < this.numPlanets; n++) {
        for (let o = 0; o < this.numPlanets; o++) {
          temp[n][o] = temp[n][o] || (temp[n][m] && temp[m][o]);
        }
      }
    }

    return temp;
  }

  countEdges(matrix: boolean[][]): number {
    return matrix.reduce((acc, row) =>
      acc + row.reduce((total, column) => total + (column ? 1 : 0), 0), 0);
  }

  runSolution1(): string {
    const input = this.readFile(this.INPUT);
    const orbits = this.format(input);
    this.parsePlanets(orbits);
    const matrix = this.fillMatrix(orbits);
    const transitiveClosure = this.warshall(matrix);
    const totalEdges = this.countEdges(transitiveClosure);

    return totalEdges.toString();
  }

  runSolution2(): string {
    return "Not yet implemented";
  }
}

export default Day06;
