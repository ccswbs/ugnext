import { readdir } from "fs/promises";
import { join } from "path";

export const listFiles = async (directory) => {
  const dirents = await readdir(directory, { withFileTypes: true, recursive: true });
  const fileNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => join(dirent.path, dirent.name));
  return fileNames;
};
