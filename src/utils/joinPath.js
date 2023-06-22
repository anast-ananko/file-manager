import { join, resolve } from 'path';

export const joinPath = (currentDir, path) => {
  if (path.startsWith('/')) {
    return join(currentDir, path);
  } else {
    return resolve(currentDir, path);
  }
}
