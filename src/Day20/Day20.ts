import DaySolution from '../Utils/daySolution';
import Graph, { Vertex } from './Graph';

interface InfoVertex {
  x: number,
  y: number,
  name: string|null,
  distance: number,
  visited: boolean,
  outermost: boolean,
};

type CoordsVertex = Vertex<string, InfoVertex>;

class Day20 extends DaySolution {
  private readonly INPUT: string = "./Day20/resources/input-1.txt";
  private map: Graph<string, InfoVertex> = new Graph();

  private parse(input: string): void {
    const matrix: Map<string, CoordsVertex> = new Map();
    const temp: Map<string, CoordsVertex> = new Map();
    let width = 0, height = 0;
    height = input.split('\n').length - 2;
    width = input.split('\n')[0].split('').length - 1;

    input.split('\n').forEach((row, i) => row.split('').forEach((point, j) => {
      if (point != "#" && point != " ") {
        matrix.set(`${j},${i}`, new Vertex(`${j},${i}`,
          { x: j, y: i, name: point == '.' ? null : point, distance: 0, visited: false, outermost: j == 2 || j == width - 2 || i == 2 || i == height - 2 }
        ));
        temp.set(`${j},${i}`, new Vertex(`${j},${i}`,
          { x: j, y: i, name: point == '.' ? null : point, distance: 0, visited: false, outermost: j == 2 || j == width - 2 || i == 2 || i == height - 2 }
        ));
      }
    }));

    const getName = (vertex: CoordsVertex): string|null => {
      let elem: CoordsVertex|undefined;

      elem = temp.get(`${vertex.info.x + 1},${vertex.info.y}`);
      if (elem != undefined) {
        if (elem.info.name != null) {
          return elem.info.name + temp.get(`${vertex.info.x + 2},${vertex.info.y}`)!.info.name;
        }
      }

      elem = temp.get(`${vertex.info.x - 1},${vertex.info.y}`);
      if (elem != undefined) {
        if (elem.info.name != null) {
          return temp.get(`${vertex.info.x - 2},${vertex.info.y}`)!.info.name + elem.info.name ;
        }
      }

      elem = temp.get(`${vertex.info.x},${vertex.info.y + 1}`);
      if (elem != undefined) {
        if (elem.info.name != null) {
          return elem.info.name + temp.get(`${vertex.info.x},${vertex.info.y + 2}`)!.info.name;
        }
      }

      elem = temp.get(`${vertex.info.x},${vertex.info.y - 1}`);
      if (elem != undefined) {
        if (elem.info.name != null) {
          return temp.get(`${vertex.info.x},${vertex.info.y - 2}`)!.info.name + elem.info.name;
        }
      }

      return null;
    }

    const getNeighbours = (vertex: CoordsVertex) => {
      let elem: CoordsVertex|undefined;
      const neighbours: CoordsVertex[] = [];

      elem = temp.get(`${vertex.info.x + 1},${vertex.info.y}`);
      if (elem != undefined && elem.info.name == null) {
        neighbours.push(elem);
      }

      elem = temp.get(`${vertex.info.x - 1},${vertex.info.y}`);
      if (elem != undefined && elem.info.name == null) {
        neighbours.push(elem);
      }

      elem = temp.get(`${vertex.info.x},${vertex.info.y + 1}`);
      if (elem != undefined && elem.info.name == null) {
        neighbours.push(elem);
      }

      elem = temp.get(`${vertex.info.x},${vertex.info.y - 1}`);
      if (elem != undefined && elem.info.name == null) {
        neighbours.push(elem);
      }

      return neighbours;
    }

    for (let vertex of matrix.values()) {
      if (vertex.info.name == null) {
        vertex.info.name = getName(vertex);
        for (let neighbour of getNeighbours(vertex)) {
          vertex.createDirectedEdge(neighbour);
        }
        this.map.addVertex(vertex);
      }
    }

    for (let vertex of matrix.values()) {
      if (vertex.info.name != null) {
        const portal = Array.from(matrix.values()).find(elem => elem != vertex && elem.info.name == vertex.info.name);
        if (portal != undefined) {
          vertex.createDirectedEdge(portal);
        }
      }
    }
  }

  private BFSDistance(origin: CoordsVertex, target: CoordsVertex): number {
    let queue: CoordsVertex[] = [];
    let current = origin;
    let distance = 0;

    current.info.visited = true;
    queue.push(current);

    while (queue.length != 0) {
      current = queue.shift()!;
      distance = current.info.distance;

      for (let neighbour of current.getConnections(this.map)) {
        if (!neighbour.info.visited) {
          neighbour.info.visited = true;
          neighbour.info.distance = distance + 1;
          queue.push(neighbour);
        }

        if (neighbour == target) {
          return distance + 1;
        }
      }
    }

    // Should never be reached.
    return 0;
  }

  private BFSDistanceRecursiveSpace(origin: CoordsVertex, target: CoordsVertex): number {
  }

  runSolution1(): string {
    this.parse(this.readFile(this.INPUT, false));
    const origin = this.map.getAllVertices().find(vertex => vertex.info.name == "AA");
    const target = this.map.getAllVertices().find(vertex => vertex.info.name == "ZZ");

    const result = this.BFSDistance(origin!, target!);

    return result.toString();
  }

  runSolution2(): string {
    this.map = new Graph();
    //this.parse(this.readFile(this.INPUT, false));
    this.parse(this.readFile("./Day20/resources/input-test-1.txt", false));
    const origin = this.map.getAllVertices().find(vertex => vertex.info.name == "AA");
    const target = this.map.getAllVertices().find(vertex => vertex.info.name == "ZZ");

    const result = this.BFSDistanceRecursiveSpace(origin!, target!);

    return result.toString();
  }
}

export default Day20;
