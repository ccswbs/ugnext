import path from "path";
import { getYamlData } from "@/data/yaml/programs";
import { z } from "zod";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "certificate-and-diploma");

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

export async function getCertificateAndDiplomaProgramTypes() {
  return Object.values(programTypes).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCertificateAndDiplomaPrograms() {
  return Object.values(programs).sort((a, b) => a.name.localeCompare(b.name));
}
