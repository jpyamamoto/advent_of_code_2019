import daySolution from '../Utils/daySolution';

class Node {
  private static idCounter = 0;

  id: number;
  name: string;
  parent: Node|null;
  children: Node[];
  leaf: boolean;

  constructor(name: string) {
    this.id = Node.idCounter++;
    this.name = name;
    this.parent = null;
    this.children = [];
    this.leaf = true;
  }

  addChildren(node: Node) {
    this.leaf = false;
    this.children.push(node);
  }

  assignParent(node: Node) {
    this.parent = node;
  }

  isLeaf(): boolean {
    return this.leaf;
  }

  getChildren(): Node[] {
    return this.children;
  }
}

interface Planets {
  [name: string] : Node
}

class Day06 extends daySolution {
  private readonly INPUT: string = "./Day06/resources/input-1.txt";
  private planets: Planets = {};

  format(input: string): string[][] {
    const orbits = input.split('\n');
    return orbits.map(orbit => orbit.split(')'));
  }

  parse(input: string[][]): void {
    input.map(orbit => {
      const orbittedName: string = orbit[0];
      const orbitterName: string = orbit[1];
      let orbitted = this.planets[orbittedName];
      let orbitter = this.planets[orbitterName];
      if (orbitted == undefined) {
        orbitted = new Node(orbittedName);
        this.planets[orbittedName] = orbitted;
      }
      if (orbitter == undefined) {
        orbitter = new Node(orbitterName);
        this.planets[orbitterName] = orbitter;
      }
      orbitted.addChildren(orbitter);
      orbitter.assignParent(orbitted);
    })
  }

  getDepthLeaves(node: Node, depth: number): number[] {
    if (node.isLeaf()) {
      return [depth];
    }

    let depths: number[] = [];
    for (let children of node.getChildren()) {
      depths = depths.concat(this.getDepthLeaves(children, depth + 1));
    }

    return depths;
  }

  runSolution1(): string {
    //const input = this.readFile(this.INPUT);
    const input = this.readFile("./Day06/resources/input-test.txt");
    const orbits = this.format(input);
    this.parse(orbits);
    const leaves = this.getDepthLeaves(this.planets["COM"], 0);
    const edgesTransitiveClosure = leaves.reduce((acc, x) => acc + ((x * (x + 1)) / 2), 0);

    return edgesTransitiveClosure.toString();
  }

  runSolution2(): string {
    return "Not yet implemented";
  }
}

export default Day06;
