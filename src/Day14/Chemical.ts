interface IDependency {
  amount: number,
  chemical: string,
};

class Chemical {

  private static vault: Map<string, Chemical> = new Map();

  private dependencies: IDependency[];
  private output: number;
  private stored: number;
  private produced: number;

  constructor(input: string, dependencies: string) {
    const [output, name] = Chemical.generateOutput(input);
    this.output = output;
    this.stored = 0;
    this.produced = 0;
    this.dependencies = Chemical.generateDependencies(dependencies);
    Chemical.vault.set(name, this);
  }

  private static generateOutput(input: string): [number, string] {
    const [amount, name] = input.trim().split(' ');

    return [Number.parseInt(amount), name];
  }

  private static generateDependencies(dependencies: string): IDependency[] {
    if (dependencies.length == 0) {
      return [];
    }

    const deps = dependencies.split(',').map(line => line.trim());
    const result = deps.map(dep => {
      const [amount, name] = dep.split(' ');
      return { amount: Number.parseInt(amount), chemical: name };
    })

    return result;
  }

  public static produce(amount: number, chemical: string): void {
    for (let chemical of Chemical.vault.values()) {
      chemical.stored = 0;
      chemical.produced = 0;
    }

    if (Chemical.vault.has(chemical)) {
      Chemical.vault.get(chemical)!.produce(amount);
    }
  }

  private produce(amount: number) {
    const needed = this.stored > amount ? 0 : amount - this.stored;
    this.stored = this.stored > amount ? this.stored - amount : 0;
    const coefficient = Math.ceil(needed / this.output);

    if (needed != 0) {
      for (let { amount, chemical } of this.dependencies) {
        Chemical.vault.get(chemical)!.produce(amount * coefficient);
      }

      this.produced += this.output * coefficient;
      this.stored = (this.output * coefficient) - needed;
    }
  }

  public static totalProduced(chemical: string): number {
    return Chemical.vault.get(chemical)!.produced;
  }
}

export default Chemical;
