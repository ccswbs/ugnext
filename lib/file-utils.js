import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { glob } from "glob";
import * as YAML from "yaml";

export async function parseYamlFiles(path) {
  const paths = await glob(path);

  const files = paths.map(async (path) => {
    const file = (await readFile(path, "utf8")).toString();
    return YAML.parse(file);
  });

  if (files.length === 1) {
    return await files[0];
  }

  return Promise.all(files);
}

export const listFiles = async (directory) => {
  const dirents = await readdir(directory, { withFileTypes: true, recursive: true });
  const fileNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => join(dirent.path, dirent.name));
  return fileNames;
};
