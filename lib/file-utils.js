import { readFile, readdir } from "fs/promises";
import { parse } from "yaml";
import { join } from "path";

export const readYamlFile = async (path) => {
  try {
    const data = await readFile(path, "utf-8");
    return parse(data);
  } catch (e) {
    return new Error(`Failed to read file ${path}: ${e.message}`);
  }
};

export const listFiles = async (directory) => {
  const dirents = await readdir(directory, { withFileTypes: true, recursive: true });

  return dirents.filter((dirent) => dirent.isFile()).map((dirent) => join(dirent.path, dirent.name));
};
