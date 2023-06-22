import { homedir } from 'os';

import { app } from "./app.js";
 
const args = process.argv.slice(2);
const usernameArg = args.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Anonymous';

const greeting = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
}

app(username, homedir());
