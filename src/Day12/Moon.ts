class Moon {
  private static counter: number = 0;

  private id: number;

  private originalX: number;
  private originalY: number;
  private originalZ: number;

  private x: number;
  private y: number;
  private z: number;

  private velX: number;
  private velY: number;
  private velZ: number;

  constructor(x: number, y: number, z: number) {
    this.id = ++Moon.counter;

    this.originalX = x;
    this.originalY = y;
    this.originalZ = z;

    this.x = x;
    this.y = y;
    this.z = z;

    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;
  }

  sameAsOriginalX() {
    return this.originalX == this.x && this.velX == 0;
  }

  sameAsOriginalY() {
    return this.originalY == this.y && this.velY == 0;
  }

  sameAsOriginalZ() {
    return this.originalZ == this.z && this.velZ == 0;
  }

  changeVelocity(moons: Moon[]): void {
    for (let moon of moons) {
      if (moon.id == this.id) {
        continue;
      }

      this.velX += this.x < moon.x ? 1 : (this.x > moon.x ? -1 : 0);
      this.velY += this.y < moon.y ? 1 : (this.y > moon.y ? -1 : 0);
      this.velZ += this.z < moon.z ? 1 : (this.z > moon.z ? -1 : 0);
    }
  }

  changePosition(): void {
    this.x += this.velX;
    this.y += this.velY;
    this.z += this.velZ;
  }

  getPotentialEnergy() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  getKineticEnergy() {
    return Math.abs(this.velX) + Math.abs(this.velY) + Math.abs(this.velZ);
  }
}

export default Moon;
