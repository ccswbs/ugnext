import { glob } from "glob";
import { readFile } from "fs/promises";
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