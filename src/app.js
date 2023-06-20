import { createInterface } from 'readline/promises';
import question from 'readline/promises';

export const app = (username) => { 

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  process.on('exit', () => console.log(`\nThank you for using File Manager, ${username}, goodbye!`));

  process.on('SIGINT', () => {
    process.exit();
  });
  
  rl.on('line', (input) => {
    if (input === '.exit') {
      exitHandler();
    }
  });
}
