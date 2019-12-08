import DaySolution from '../Utils/daySolution';

enum Colors {
  Black = 0,
  White = 1,
  Transparent = 2,
};

class Day08 extends DaySolution {
  private readonly INPUT: string = "./Day08/resources/input-1.txt";
  private readonly WIDTH: number = 25;
  private readonly HEIGHT: number = 6;

  private parse(input: string): number[][] {
    const n = this.WIDTH * this.HEIGHT;
    const temp: string[][] = [];
    let result: number[][] = [];

    for (let i = 0; i < input.length; i += n) {
      temp.push(input.slice(i, i + n).split(""));
    }

    result = temp.map(layer => layer.map(num => Number.parseInt(num)));

    return result;
  }

  private countDigits(layer: number[], digit: number): number {
    return layer.reduce((acc, num) => num == digit ? acc + 1 : acc, 0);
  }

  private selectLayer(layers: number[][]): number[] {
    let numZeros = this.countDigits(layers[0], Colors.Black);
    let selectedLayer: number[] = layers[0];

    for (let layer of layers) {
      const zeros = this.countDigits(layer, Colors.Black);
      if (numZeros > zeros) {
        numZeros = zeros;
        selectedLayer = layer;
      }
    }

    return selectedLayer;
  }

  private processImage(layers: number[][]): number[] {
    const image: number[] = [];

    for (let i = 0; i < this.WIDTH * this.HEIGHT; i++) {
      for (let layer of layers) {
        if (layer[i] != Colors.Transparent) {
          image[i] = layer[i];
          break;
        }
      }
    }

    return image;
  }

  private printableImage(image: number[]): string {
    let result = "\n";

    for (let i = 0; i < this.HEIGHT; i++) {
      for (let j = 0; j < this.WIDTH; j++) {
        result += image[(i * this.WIDTH) + j] == Colors.Black ? " " : "█";
      }

      result += "\n";
    }

    return result;
  }

  runSolution1(): string {
    const input = this.readFile(this.INPUT);
    const image = this.parse(input);
    const layer = this.selectLayer(image);
    const result = this.countDigits(layer, Colors.White) * this.countDigits(layer, Colors.Transparent);
    return result.toString();
  }

  runSolution2(): string {
    const input = this.readFile(this.INPUT);
    const layers = this.parse(input);
    const imageInfo = this.processImage(layers);
    const image = this.printableImage(imageInfo);

    return image;
  }
}

export default Day08;
