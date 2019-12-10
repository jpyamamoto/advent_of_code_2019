import DaySolution from '../Utils/daySolution';

interface Asteroid {
  x: number,
  y: number,
};

interface AsteroidPC {
  asteroid: Asteroid,
  angle: number,
  distance: number,
};

interface AsteroidDB {
  angle: number,
  asteroids: AsteroidPC[],
}

class Day10 extends DaySolution {
  private readonly INPUT: string = "./Day10/resources/input-1.txt";
  private readonly ASTEROIDCHAR: string = "#";
  private width: number = 0;
  private height: number = 0;
  private map: Asteroid[][] = [];

  private parse(input: string): Asteroid[] {
    const rows = input.split('\n');
    const result: Asteroid[] = [];
    this.width = rows[0].length;
    this.height = rows.length;
    this.map = new Array(this.width).fill(null).map(
      () => new Array(this.height).fill(null)
    );
    let y = 0;

    for (let row of rows) {
      const columns = row.split('');
      let x = 0;

      for (let column of columns) {
        if (column == this.ASTEROIDCHAR) {
          this.map[x][y] = { x: x, y: y };
          result.push({ x: x, y: y });
        }
        x++;
      }

      y++;
    }

    return result;
  }

  private asteroidsInQuadrant(x1: number, x2: number, y1: number, y2: number): Asteroid[] {
    const result: Asteroid[] = [];

    for (let i = x1; i < x2; i++) {
      for (let j = y1; j < y2; j++) {
        const point = this.map[i][j];
        if (point != null) {
          result.push(point);
        }
      }
    }

    return result;
  }

  private slopeOf({ x: x1, y: y1 }: Asteroid, { x: x2, y: y2 }: Asteroid): number {
    return (y2 - y1) / (x2 - x1);
  }

  private differentSlopes(point: Asteroid, asteroids: Asteroid[]): number {
    const slopes: Set<number> = new Set();

    for (let asteroid of asteroids) {
      slopes.add(this.slopeOf(point, asteroid));
    }

    return slopes.size;
  }

  private reachableAsteroidsFrom(asteroid: Asteroid): number {
    let quads: Asteroid[][] = [];
    quads.push(this.asteroidsInQuadrant(0, asteroid.x, 0, asteroid.y));
    quads.push(this.asteroidsInQuadrant(asteroid.x, this.width, 0, asteroid.y));
    quads.push(this.asteroidsInQuadrant(0, asteroid.x, asteroid.y, this.height));
    quads.push(this.asteroidsInQuadrant(asteroid.x, this.width, asteroid.y, this.height));

    let result = 0;
    for (let quad of quads) {
      result += this.differentSlopes(asteroid, quad);
    }

    // 1 accounts for the asteroid itself being checked against.
    return result - 1;
  }

  private bestAsteroid(asteroids: Asteroid[]): [Asteroid, number] {
    let detectedAsteroids = 0;
    let bestAsteroid;

    for (let asteroid of asteroids) {
      const numAsteroids = this.reachableAsteroidsFrom(asteroid);
      if (numAsteroids > detectedAsteroids) {
        detectedAsteroids = numAsteroids;
        bestAsteroid = asteroid;
      }
    }

    return [ (bestAsteroid as Asteroid), detectedAsteroids];
  }

  private getPolarCoords({ x: x1, y: y1 }: Asteroid, { x: x2, y: y2 }: Asteroid): [number, number] {
    const dx = x2 - x1;
    const dy = (y2 - y1);
    // (x, y) rotated 90 degrees counter clockwise is (-y, x)
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    let angle = Math.atan2(dx, -dy);
    angle = angle < 0 ? angle + (2 * Math.PI) : angle;
    angle = angle == 360 ? 0 : angle;

    return [angle * (180 / Math.PI), distance];
  }

  private parseAsPolarCoords(origin: Asteroid, asteroids: Asteroid[]): AsteroidDB[] {
    const angles: Set<number> = new Set();
    const asteroidsPC: AsteroidPC[] = [];
    const result: AsteroidDB[] = [];

    for (let asteroid of asteroids) {
      const [ angle, distance ] = this.getPolarCoords(origin, asteroid);
      const asteroidPolar = { asteroid: asteroid, angle: angle, distance: distance };
      angles.add(asteroidPolar.angle);
      asteroidsPC.push(asteroidPolar);
    }

    for (let angle of Array.from(angles).sort((a, b) => a - b)) {
      result.push({ angle: angle, asteroids: asteroidsPC.filter(elem => elem.angle == angle) });
    }

    return result;
  }

  private getCloserAsteroid(asteroids: AsteroidPC[]): number {
    let i = 0;
    let lastDistance = asteroids[0].distance;
    let lastI = 0;

    for (let asteroid of asteroids) {
      if (lastDistance > asteroid.distance) {
        lastDistance = asteroid.distance;
        lastI = i;
      }
      i++;
    }

    return lastI;
  }

  private killAsteroids(num: number, asteroids: AsteroidDB[]): Asteroid {
    let lastAsteroid: Asteroid = { x: 0, y: 0 };

    for (let angleElems of asteroids) {
      if (num == 0) {
        break;
      }

      if (angleElems.asteroids.length == 0) {
        continue;
      }

      num--;
      const minDistanceIndex = this.getCloserAsteroid(angleElems.asteroids);
      lastAsteroid = angleElems.asteroids.splice(minDistanceIndex, 1)[0].asteroid;
    }

    return lastAsteroid;
  }

  runSolution1(): string {
    const input = this.readFile(this.INPUT);
    const asteroids = this.parse(input);
    const [ , numVisible ] = this.bestAsteroid(asteroids);

    return numVisible.toString();
  }

  runSolution2(): string {
    const input = this.readFile(this.INPUT);
    let asteroids = this.parse(input);
    const [asteroid, ] = this.bestAsteroid(asteroids);
    const i = asteroids.findIndex(elem => elem.x == asteroid.x && elem.y == asteroid.y);
    asteroids.splice(i, 1);

    const polarAsteroids = this.parseAsPolarCoords(asteroid, asteroids);
    const lastAsteroid = this.killAsteroids(200, polarAsteroids);

    return ((lastAsteroid.x * 100) + lastAsteroid.y).toString();
  }
}

export default Day10;
