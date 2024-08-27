import { readFile } from 'fs/promises';
import { parse } from 'yaml';

export const readYamlFile = async (path) => {
  const data = await readFile(path, 'utf-8');
  return parse(data);
};
