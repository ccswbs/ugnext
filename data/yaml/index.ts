import path from "path";
import { glob } from "glob";
import { readFile } from "fs/promises";
import * as YAML from "yaml";

export const YAML_DATA_ROOT = path.join(process.cwd(), "data", "yaml");

/**
 * Yields YAML files matched by a glob pattern
 * @param pattern - An array of glob patterns or a single glob pattern to match files
 * @yields An object containing the file path and its parsed YAML content
 */
export async function* yaml(pattern: string | string[]) {
  let paths: string[] = [];

  if (Array.isArray(pattern)) {
    for (const pat of pattern) {
      const matches = await glob(pat);
      paths.push(...matches);
    }
  } else {
    paths = await glob(pattern);
  }

  for (const filePath of paths) {
    const content = await readFile(filePath, "utf8");
    const filename = path.parse(filePath).name;
    const parsed = YAML.parse(content);
    yield { path: filePath, filename: filename, data: parsed };
  }
}

export async function yamlFile(filePath: string) {
  const content = await readFile(filePath, "utf8");
  const parsed = YAML.parse(content);
  const filename = path.parse(filePath).name;

  return { path: filePath, filename: filename, data: parsed };
}
