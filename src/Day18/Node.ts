import NodeType from './NodeType';

class Node {
  private static nodes: Map<string, Node> = new Map();

  private name: string;
  private type: NodeType;
  private coords: string;
  private x: number;
  private y: number;
  private dependencies: Map<string, Node[]>;
  private distances: Map<string, number>;

  public static getNodes(): Node[] {
    return Array.from(Node.nodes.values());
  }
  
  public static cleanNodes(): void {
    Node.nodes.clear();
  }

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.type = name == "@" ? NodeType.Robot : (name.toLowerCase() == name ? NodeType.Key : NodeType.Door);
    this.coords = `${x},${y}`;
    this.x = x;
    this.y = y;
    this.dependencies = new Map();
    this.distances = new Map();

    Node.nodes.set(this.coords, this);
  }

  public getCoords(): string {
    return this.coords;
  }

  public distanceTo(node: Node): number|undefined {
    return this.distances.get(node.name);
  }

  public setDistanceTo(node: Node, distance: number): void {
    this.distances.set(node.name, distance);
  }

  public setDependenciesTo(node: Node, deps: string[]): void {
    if (node.name == this.name) {
      return;
    }

    const dependencies: Node[] = [];

    for (let dep of deps) {
      const otherNode = Node.nodes.get(dep)!;
      dependencies.push(otherNode);
    }

    this.dependencies.set(node.name, dependencies);
  }

  public isKey(): boolean {
    return this.type == NodeType.Key;
  }

  public allDependenciesMet(to: Node, keys: Node[]): boolean {
    return this.dependencies.get(to.name)!.every(dep => {
      switch (dep.type) {
        case NodeType.Key:  return !keys.includes(dep);
        case NodeType.Door: return keys.every(key => key.name != dep.name.toLowerCase());
        default:            return true;
      }
    });
  }

  public reachableKeys(missingKeys: Node[]): Node[] {
    return Node.getNodes().filter(node => {
      return node.isKey() && missingKeys.includes(node) && this.allDependenciesMet(node, missingKeys);
    });
  }
  
  public getName(): string {
    return this.name;
  }
}

export default Node;
