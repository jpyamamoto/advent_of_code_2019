export class Vertex<T extends number|string, K> {
  private readonly id: T;
  public readonly info: K;
  private connections: Set<T>;

  constructor(id: T, info: K) {
    this.id = id;
    this.info = info;
    this.connections = new Set();
  }

  public getId(): T {
    return this.id;
  }

  public createDirectedEdge(vertex: Vertex<T, K>) {
    this.connections.add(vertex.id);
  }

  public createEdge(vertex: Vertex<T, K>) {
    this.connections.add(vertex.id);
    vertex.connections.add(this.id);
  }

  public getConnections(graph: Graph<T, K>): Vertex<T, K>[] {
    const result: Vertex<T, K>[] = [];

    for (let conn of this.connections.values()) {
      result.push(graph.getVertex(conn));
    }

    return result;
  }
}

export default class Graph<T extends number|string, K> {
  private vertices: Map<T, Vertex<T, K>>;

  constructor() {
    this.vertices = new Map();
  }

  public addVertex(vertex: Vertex<T, K>) {
    this.vertices.set(vertex.getId(), vertex);
  }

  public getVertex(id: T): Vertex<T, K> {
    return this.vertices.get(id)!;
  }

  public getAllVertices(): Vertex<T, K>[] {
    return Array.from(this.vertices.values());
  }
}
