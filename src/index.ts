import readline from 'readline';

import runDay01 from './Day01';

let read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

read.question("Day to run: ", (day) => {
  console.log(`Running solutions of day ${day}.`);

  const dayInt = Number.parseInt(day);
  if (dayInt == 1) { runDay01(); }
  else { console.log(`Solutions of day ${day} not implemented.`); }

  read.close()
})
