import daySolution from '../Utils/daySolution';

class Planet {
  id: number;
  name: string;
  neighbours: Set<Planet>;
  visited: boolean;
  distance: number;

  constructor(name: string, id: number) {
    this.id = id;
    this.name = name;
    this.neighbours = new Set();
    this.visited = false;
    this.distance = 0;
  }

  addNeighbour(neighbour: Planet) {
    this.neighbours.add(neighbour);
  }

  visiting() {
    this.visited = true;
  }

  setDistance(dist: number) {
    this.distance = dist;
  }
}

interface Planets {
  [name: string] : Planet
}

class Day06 extends daySolution {
  private readonly INPUT: string = "./Day06/resources/input-1.txt";
  private planets: Planets = {};
  private numPlanets: number = 0;
  private orbits: string[][];

  constructor() {
    super();
    const input = this.readFile(this.INPUT);
    this.orbits = this.format(input);
    this.parsePlanets(this.orbits);
  }

  format(input: string): string[][] {
    const orbits = input.split('\n');
    return orbits.map(orbit => orbit.split(')'));
  }

  parsePlanets(orbits: string[][]): void {
    const planets = orbits.reduce((acc, orbit) => acc.concat(orbit));
    const planetsSet = new Set(planets);

    for (let planet of planetsSet) {
      this.planets[planet] = new Planet(planet, this.numPlanets++);
    }

    for (let orbit of orbits) {
      let orbitted = this.planets[orbit[0]];
      let orbitter = this.planets[orbit[1]];

      orbitted.addNeighbour(orbitter);
      orbitter.addNeighbour(orbitted);
    }
  }

  getIdOfPlanet(name: string): number {
    return this.planets[name].id;
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

  breadthFirstSearch(): void {
    let queue: Planet[] = [];
    let current: Planet = this.planets["SAN"];
    current.visiting();
    queue.push(current);
    
    main:
    while(queue.length != 0) {
      current = queue.shift()!;

      for (let neighbour of current.neighbours) {
        if (!neighbour.visited) {
          neighbour.visiting();
          neighbour.setDistance(current.distance + 1);
          queue.push(neighbour);

          if (neighbour.name == "YOU") {
            break main;
          }
        }
      }
    }
  }

  runSolution1(): string {
    const matrix = this.fillMatrix(this.orbits);
    const transitiveClosure = this.warshall(matrix);
    const totalEdges = this.countEdges(transitiveClosure);

    return totalEdges.toString();
  }

  runSolution2(): string {
    this.breadthFirstSearch();
    return `${this.planets["YOU"].distance - 2}`;
  }
}

export default Day06;
