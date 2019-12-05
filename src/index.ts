import readline from 'readline';

import runDay01 from './Day01';
import runDay02 from './Day02';
import runDay03 from './Day03';
import runDay04 from './Day04';
import runDay05 from './Day05';

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
  else { console.log(`Solutions of day ${day} not implemented.`); }

  read.close()
})
