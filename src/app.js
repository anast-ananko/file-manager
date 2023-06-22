import { createInterface } from 'readline/promises';

import { parseInput } from './utils/parseInput.js';
import { joinPath } from './utils/joinPath.js';
import * as nwd from './commands/nwd.js';

export const app = async (username, homedir) => { 
  let currentDir = homedir;

  const goodbye = () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`)
  }

  process.on('exit', () => goodbye());

  process.on('SIGINT', () => {
    process.exit();
  });
  
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const up = async () => {
    currentDir = joinPath(currentDir, '..');
  }

  const cd = async (args) => {
    currentDir = await nwd.cd(currentDir, args);
  }

  const ls = async () => {
    await nwd.ls(currentDir);
  }

  const commands = new Map();
  commands.set('up', up);
  commands.set('cd', cd);
  commands.set('ls', ls);

  while(true) {
    const answer = await rl.question(`You are currently in ${currentDir}\n`);

    if (answer == '.exit') {
      process.exit();
    }

    const [ command, ...args ] = parseInput(answer);
    // console.log(command);
    // console.log(args);

    try {
      const commandFn = commands.get(command);
      if (commandFn) {
        await commandFn(...args);
      } else {
        console.log(`Unknown command: ${command}`);
      }
    } catch (error) { 
      console.log(`Operation failed: ${error.message}`)
    }    

  } 
     
}
