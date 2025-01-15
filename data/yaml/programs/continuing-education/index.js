import path from "path";
import { z } from "zod";
import { getYamlData } from "@/data/yaml/programs";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "continuing-education");

const programTypes = await getYamlData({
  path: path.join(directory, "program-types.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const programs = await getYamlData({
  path: path.join(directory, "programs", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    types: z.array(z.enum(Object.keys(programTypes))),
    tags: z.array(z.string()),
  }),
  parser: (program) => ({
    ...program,
    types: program.types.map((type) => programTypes[type]),
  }),
});

export async function getContinuingEducationProgramTypes() {
  return Object.values(programTypes).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getContinuingEducationPrograms() {
  return Object.values(programs).sort((a, b) => a.name.localeCompare(b.name));
}
