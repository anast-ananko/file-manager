import { createReadStream, createWriteStream } from 'fs';
import { writeFile, rename, rm as removeFile } from 'fs/promises';
import { basename, resolve, dirname, join } from 'path';

import { isExists } from '../utils/isExists.js';

const cat = async (filePath) => {
	if (!await isExists(filePath)) {
		throw new Error('No such original file');      
	} 

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

const rn = async (filePath, newFilename) => {
	if (!await isExists(filePath)) {
		throw new Error('No such original file');      
	} 

	const directory = dirname(filePath);
	const newFilePath = join(directory, newFilename);

	if (await isExists(newFilePath)) {
		throw new Error('File with that name already exists');      
	} 

	try {
		await rename(filePath, newFilePath);
	} catch {
		throw new Error('Error while renaming file');   
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

	if (await isExists(targetPath)) {
		throw new Error('File already exists in destination directory');      
	}  

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

	if (await isExists(targetPath)) {
		throw new Error('File already exists in destination directory');      
	}  

	const sourceStream = createReadStream(sourcePath);
	const destinationStream = createWriteStream(targetPath);

	sourceStream.pipe(destinationStream);
	
	try {
		await removeFile(sourcePath);
	} catch {
		throw new Error('Error while deleting file');  
	}	
}

const rm = async (filePath) => {
  if (!(await isExists(filePath))) {
    throw new Error('File does not exist');
  } 

	try {
		await removeFile(filePath);
	} catch {
		throw new Error('Error while deleting file');  
	}  
}

export { cat, add, rn, cp, mv, rm };
