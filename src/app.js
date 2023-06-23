import { createInterface } from 'readline/promises';
import { resolve } from 'path';

import { parseInput } from './utils/parseInput.js';
import { successfulMessage } from './utils/constants.js';
import * as nwd from './commands/nwd.js';
import * as fs from './commands/fs.js';
import { operatingSystem } from './commands/os.js';


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
    currentDir = resolve(currentDir, '..');
  }

  const cd = async ([path]) => {
    currentDir = await nwd.cd(currentDir, path);
  }

  const ls = async () => {
    await nwd.ls(currentDir);
  }

  const cat = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await fs.cat(filePath);
  }

  const add = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await fs.add(filePath);    
  }

  const cp = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);

    await fs.cp(sourcePath, destination);
  }

  const mv = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);

    await fs.mv(sourcePath, destination);
  }

  const rm = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await fs.rm(filePath);
  }

  const os = async ([arg]) => {
    operatingSystem(arg);
  }

  const commands = new Map();
  commands.set('up', up);
  commands.set('cd', cd);
  commands.set('ls', ls);
  commands.set('cat', cat);
  commands.set('add', add);
  commands.set('cp', cp);
  commands.set('mv', mv);
  commands.set('rm', rm);
  commands.set('os', os);


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
        await commandFn(args);
        console.log(successfulMessage);
      } else {
        console.log(`Unknown command: ${command}`);
      }
    } catch (error) { 
      console.log(`Operation failed: ${error.message}`)
    }    

  } 
     
}
