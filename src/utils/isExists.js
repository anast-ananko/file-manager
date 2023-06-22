import { access } from 'fs/promises';

export const isExists = async (path) => {
  try {
    await access(path);
    return true; 
  } catch {
    return false; 
  }
};
