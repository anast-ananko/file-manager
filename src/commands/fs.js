import { createReadStream, createWriteStream } from 'fs';
import { writeFile, rm as removeFile } from 'fs/promises';
import { basename, resolve } from 'path';

import { isExists } from '../utils/isExists.js';

const cat = async (filePath) => {
	const readableStream = createReadStream(filePath, 'utf8');

	readableStream.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

	readableStream.on('end', () => {
		process.stdout.write('\n');
	});

  await new Promise((resolve, reject) => {
    readableStream.on("end", () => resolve());
    readableStream.on("error", () =>  reject());
  });
}

const add = async (filePath) => {
	try {
    await writeFile(filePath, '', { flag: 'wx' })
  } catch {
		throw new Error('Failed to add file');
  }
}

const cp = async (sourcePath, destinationDir) => {
	if (!await isExists(sourcePath)) {
		throw new Error('No such original file');      
	} 

	if (!await isExists(destinationDir)) {
		throw new Error('No such destination directory');      
	}  

	const fileName = basename(sourcePath);
	const targetPath = resolve(destinationDir, fileName);

	const sourceStream = createReadStream(sourcePath);
    const destinationStream = createWriteStream(targetPath);
	
  sourceStream.pipe(destinationStream);
}

const mv = async (sourcePath, destinationDir) => {
	if (!await isExists(sourcePath)) {
		throw new Error('No such original file');      
	} 

	if (!await isExists(destinationDir)) {
		throw new Error('No such destination directory');      
	}  

	const fileName = basename(sourcePath);
	const targetPath = resolve(destinationDir, fileName);

	const sourceStream = createReadStream(sourcePath);
	const destinationStream = createWriteStream(targetPath);

	sourceStream.pipe(destinationStream);
	
	await removeFile(sourcePath);
}

const rm = async (filePath) => {
  if (!(await isExists(filePath))) {
    throw new Error('File does not exist');
  } 

  await removeFile(filePath);
}

export { cat, add, cp, mv, rm };
