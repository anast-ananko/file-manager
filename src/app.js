import { createInterface } from 'readline/promises';
import { resolve } from 'path';

import { parseInput } from './utils/parseInput.js';
import * as nwd from './commands/nwd.js';
import * as fs from './commands/fs.js';
import { operatingSystem } from './commands/os.js';
import { calculateHash } from './commands/hash.js';
import * as brotli from './commands/brotli.js';
import { validate } from './utils/validate.js';

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

  const exit = () => {
    process.exit();
  }

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

  const rn = async([path, newFilename]) => {
    const filePath = resolve(currentDir, path);

    await fs.rn(filePath, newFilename);
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

  const hash = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await calculateHash(filePath);
  }

  const compress = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);
    const destinationPath = resolve(currentDir, destination);
    console.log(sourcePath)
    console.log(destinationPath)
    await brotli.compressFile(sourcePath, destinationPath);
  }

  const decompress = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);
    const destinationPath = resolve(currentDir, destination);

    await brotli.decompressFile(sourcePath, destinationPath);
  }

  const commands = new Map([
    ['.exit', exit],
    ['up', up],
    ['cd', cd],
    ['ls', ls],
    ['cat', cat],
    ['add', add],
    ['rn', rn],
    ['cp', cp],
    ['mv', mv],
    ['rm', rm],
    ['os', os],
    ['hash', hash],
    ['compress', compress],
    ['decompress', decompress]
  ]);

  while(true) {
    const answer = await rl.question(`You are currently in ${currentDir}\n`);

    const [ command, ...args ] = parseInput(answer);

    const commandFn = commands.get(command);
    if (commandFn && validate(command, args)) {
      try {
        await commandFn(args);
      } catch (error) { 
        console.log(`Operation failed. ${error?.message ? error.message : ''}`)
      }         
    } else {
      console.log('Invalid input');
    }  
  } 
     
}
