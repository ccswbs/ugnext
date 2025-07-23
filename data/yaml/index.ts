import path from "path";
import { readFile } from "fs/promises";
import * as YAML from "yaml";

export const YAML_DATA_ROOT = path.join(process.cwd(), "data", "yaml");

export async function yaml(filePath: string) {
  const content = await readFile(filePath, "utf8");
  const parsed = YAML.parse(content);
  const filename = path.parse(filePath).name;

  return { path: filePath, filename: filename, data: parsed };
}
