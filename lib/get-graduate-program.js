import { join } from 'path';
import { readYamlFile } from './file-utils';

export async function getGraduateProgram(slug, parent = "") {
  const path = join(process.cwd(), "data", "programs","graduate", parent ,`${slug}.yml`);
  const content = await readYamlFile(path);

  return content;
}
