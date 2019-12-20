import DaySolution from '../Utils/daySolution';
import Node from './Node';

class Day18 extends DaySolution {
  private readonly INPUT1: string = "./Day18/resources/input-1.txt";
  private readonly INPUT2: string = "./Day18/resources/input-2.txt";
  private map: Map<string, string> = new Map();

  private parse(input: string): void {
    let x = 0, y = 0;

    for (let row of input.split('\n')) {
      x = 0;
      for (let char of row.split('')) {
        if (char != "#") {
          if (char != ".") {
            new Node(char, x, y);
          }

          this.map.set(`${x},${y}`, char);
        }
        x++;
      }
      y++;
    }
  }

  private getNeighbours(coords: string): string[] {
    const [x, y] = coords.split(',').map(num => Number.parseInt(num));
    const neighbours: string[] = [];

    this.map.has(`${x + 1},${y}`) && neighbours.push(`${x + 1},${y}`);
    this.map.has(`${x - 1},${y}`) && neighbours.push(`${x - 1},${y}`);
    this.map.has(`${x},${y + 1}`) && neighbours.push(`${x},${y + 1}`);
    this.map.has(`${x},${y - 1}`) && neighbours.push(`${x},${y - 1}`);

    return neighbours;
  }

  private computeDistanceTo(node1: Node, node2: Node): number {
    let queue: string[] = [];
    let current = node1.getCoords();
    const target = node2.getCoords();
    let prev: Map<string, string> = new Map();

    const visited: Map<string, boolean> = new Map();
    Node.getNodes().forEach(node => visited.set(node.getCoords(), false));

    visited.set(current, true);
    queue.push(current);

    let found = false;

    main:
    while (queue.length != 0) {
      current = queue.shift()!;

      for (let neighbour of this.getNeighbours(current)) {
        if (!visited.get(neighbour)!) {
          visited.set(neighbour, true);
          prev.set(neighbour, current);
          queue.push(neighbour);

          if (neighbour == target) {
            found = true;
            break main;
          }
        }
      }
    }

    let distance = Infinity;
    const dependencies: string[] = [];

    if (found) {
      distance = 1;
      let temp: string = prev.get(target)!;

      while (temp != node1.getCoords()) {
        distance++;

        if (this.map.get(temp) != ".") {
          dependencies.push(temp);
        }

        temp = prev.get(temp)!;
      }
    }


    node1.setDependenciesTo(node2, dependencies);
    node2.setDependenciesTo(node1, dependencies);

    return distance;
  }

  private computeDistances(): void {
    for (let node of Node.getNodes()) {
      for (let otherNode of Node.getNodes()) {
        if (node != otherNode && node.distanceTo(otherNode) == undefined) {
          const distance = this.computeDistanceTo(node, otherNode);
          node.setDistanceTo(otherNode, distance);
          otherNode.setDistanceTo(node, distance);
        }
      }
    }
  }

  private getCacheIndex(robots: Set<Node>, elems: Node[]): string {
    const arrRobots = Array.from(robots);
    let result = arrRobots.map(elem => elem.getName()).sort().join(',');

    for (let elem of elems.map(elem => elem.getName()).sort()) {
      result += "," + elem;
    }

    return result;
  }

  private bestDistance(nodes: Set<Node>, keys: Node[], cache: Map<string, number>): number {
    if (keys.length == 0) {
      return 0;
    }

    const cacheElem = this.getCacheIndex(nodes, [...keys]);
    const cacheResult = cache.get(cacheElem);
    if (cacheResult != undefined) {
      return cacheResult;
    }

    let result = Infinity;

    for (let key of keys) {
      for (let node of nodes) {
        if (key == node) {
          continue;
        }

        const distance = node.distanceTo(key);
        if (distance == Infinity) {
          continue;
        }

        if (distance! >= result) {
          continue;
        }

        if (!node.allDependenciesMet(key, keys)) {
          continue;
        }

        const newNodes = new Set(nodes);
        newNodes.add(key).delete(node)
        const bestDistance = this.bestDistance(newNodes, keys.filter(elem => elem != key), cache) + distance!;

        result = Math.min(result, bestDistance);
      }
    }

    cache.set(cacheElem, result);
    return result;
  }

  runSolution1(): string {
    this.parse(this.readFile(this.INPUT1));
    this.computeDistances();

    const node = Node.getNodes().filter(node => node.getName() == "@")[0];
    const nodes: Set<Node> = new Set();
    nodes.add(node);
    const result = this.bestDistance(nodes, Node.getNodes().filter(node => node.isKey()), new Map());
    return result.toString();
  }

  runSolution2(): string {
    this.map = new Map();
    Node.cleanNodes();
    this.parse(this.readFile(this.INPUT2));
    this.computeDistances();

    const node1 = Node.getNodes().filter(node => node.getName() == "1")[0];
    const node2 = Node.getNodes().filter(node => node.getName() == "2")[0];
    const node3 = Node.getNodes().filter(node => node.getName() == "3")[0];
    const node4 = Node.getNodes().filter(node => node.getName() == "4")[0];

    const nodes: Set<Node> = new Set();
    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    nodes.add(node4);

    const result = this.bestDistance(nodes, Node.getNodes().filter(node => node.isKey()), new Map());
    return result.toString();
  }
}

export default Day18;
