import readline from 'readline';

import runDay01 from './Day01';
import runDay02 from './Day02';
import runDay03 from './Day03';
import runDay04 from './Day04';
import runDay05 from './Day05';
import runDay06 from './Day06';
import runDay07 from './Day07';
import runDay08 from './Day08';
import runDay09 from './Day09';
import runDay10 from './Day10';
import runDay11 from './Day11';
import runDay12 from './Day12';
import runDay13 from './Day13';
import runDay14 from './Day14';

let read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

read.question("Day to run: ", (day) => {
  console.log(`Running solutions of day ${day}.`);

  const dayInt = Number.parseInt(day);
  if (dayInt == 1) { runDay01(); }
  else if (dayInt == 2) { runDay02(); }
  else if (dayInt == 3) { runDay03(); }
  else if (dayInt == 4) { runDay04(); }
  else if (dayInt == 5) { runDay05(); }
  else if (dayInt == 6) { runDay06(); }
  else if (dayInt == 7) { runDay07(); }
  else if (dayInt == 8) { runDay08(); }
  else if (dayInt == 9) { runDay09(); }
  else if (dayInt == 10) { runDay10(); }
  else if (dayInt == 11) { runDay11(); }
  else if (dayInt == 12) { runDay12(); }
  else if (dayInt == 13) { runDay13(); }
  else if (dayInt == 14) { runDay14(); }
  else { console.log(`Solutions of day ${day} not implemented.`); }

  read.close()
})
