import { readFile, readdir } from 'fs/promises';
import { parse } from 'yaml';
import { join } from 'path';

export const readYamlFile = async (path) => {
	const data = await readFile(path, 'utf-8');
	return parse(data);
};

export const listFiles = async (directory) => {
	const dirents = await readdir(directory, { withFileTypes: true, recursive: true });
	const fileNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => join(dirent.path, dirent.name));
	return fileNames;
};
