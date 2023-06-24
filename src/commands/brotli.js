import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream/promises';

import { isExists } from '../utils/isExists.js';

const compressFile = async (sourcePath, destinationPath) => {
  if (!await isExists(sourcePath)) {
		throw new Error('No such original file');      
	} 

  const sourceStream = createReadStream(sourcePath);
  const destinationStream = createWriteStream(destinationPath);
  const brotliStream = createBrotliCompress();

  await pipeline(sourceStream, brotliStream, destinationStream);
}

const decompressFile = async (sourcePath, destinationPath) => {
	if (!await isExists(sourcePath)) {
		throw new Error('No such original file');      
	} 

  const sourceStream = createReadStream(sourcePath);
  const destinationStream = createWriteStream(destinationPath);
  const brotliStream = createBrotliDecompress();

  await pipeline(sourceStream, brotliStream, destinationStream);
}

export { compressFile, decompressFile };
