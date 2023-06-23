import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

import { isExists } from '../utils/isExists.js';

const calculateHash = async (filePath) => {
  if (!(await isExists(filePath))) {
    throw new Error('File does not exist');
  } 

  const hash = createHash('sha256');
  
  try {
    const content = await readFile(filePath);
    hash.update(content);
  
    const hashContent = hash.digest('hex');
    console.log(hashContent);
  } catch (error) {
    throw new Error('Can not calculate hash');
  }
};

export { calculateHash };
