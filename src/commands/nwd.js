import { join } from 'path';
import { readdir, stat } from 'fs/promises';

import { isExists } from '../utils/isExists.js';

const cd = async (currentDir, path) => {
  const dirPath = resolve(currentDir, path);

  if(!await isExists(dirPath)) {
    throw new Error('This directory does not exist');
  } else {
    return dirPath; 
  }
};

const ls = async (currentDir) => {
  try {
    const files = await readdir(currentDir, { withFileTypes: true });
    const items = [];

    for (const file of files) {
      const fileName = file.name;
      const filePath = join(currentDir, fileName);
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        items.push({ Name: fileName, Type: 'directory' });
      } else if (fileStats.isFile() && !fileStats.isSymbolicLink()) {
        const formattedFileName = `${fileName}`;
        items.push({ Name: formattedFileName, Type: 'file' });
      }
    }

    const sortedItems = items.sort((a, b) => {
      if (a.Type === b.Type) {
        return a.Name.localeCompare(b.Name);
      } else if (a.Type === 'directory') {
        return -1;
      } else {
        return 1;
      }
    });

    console.table(sortedItems);
  } catch (error){
    throw new Error(`Directory read error ${error}`);
  }
}

export { cd, ls };
