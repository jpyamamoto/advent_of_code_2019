import fs from 'fs';
import path from 'path';

abstract class DaySolution {
  protected readFile(file: string): string {
    return fs.readFileSync(path.join(__dirname, file), 'utf8').trim();
  }

  abstract runSolution1(): string
  abstract runSolution2(): string
}

export default DaySolution;
