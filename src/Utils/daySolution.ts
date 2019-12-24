import fs from 'fs';
import path from 'path';

abstract class DaySolution {
  protected readFile(file: string, trim = true): string {
    if (trim) {
      return fs.readFileSync(path.join(path.resolve(), 'dist/', file), 'utf8').trim();
    }

    return fs.readFileSync(path.join(path.resolve(), 'dist/', file), 'utf8');
  }

  abstract runSolution1(): string
  abstract runSolution2(): string
}

export default DaySolution;
