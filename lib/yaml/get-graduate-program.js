import { join } from "path";
import { readYamlFile } from "../file-utils";

export async function getGraduateProgram(slug) {
  const path = join(process.cwd(), "data", "programs", "graduate", `${slug}.yml`);
  const content = await readYamlFile(path);

  return content;
}
