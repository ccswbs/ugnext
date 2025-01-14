import { join } from "path";
import { readYamlFile } from "@/lib/file-utils";
import { glob } from "glob";
import { existsSync } from "fs";

export async function getPaths() {
  const dir = join(process.cwd(), "data", "yaml", "programs", "graduate", "**", "*.yml");
  const paths = await glob(dir);
  const files = paths.map((path) => readYamlFile(path));

  return (await Promise.all(files)).map(({ slug }) => ({
    params: {
      slug: slug.split("/").filter(Boolean),
    },
  }));
}

export async function getGraduateProgram(slug) {
  const path = join(process.cwd(), "data", "yaml", "programs", "graduate", `${slug}.yml`);

  if (!existsSync(path)) {
    return null;
  }

  return await readYamlFile(path);
}
