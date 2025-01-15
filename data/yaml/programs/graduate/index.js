import path from "path";
import { z } from "zod";
import { getYamlData } from "@/lib/file-utils";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "graduate");

const degreeTypes = await getYamlData({
  path: path.join(directory, "degree-types.yml.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const programTypes = await getYamlData({
  path: path.join(directory, "program-types.yml"),
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const degrees = await getYamlData({
  path: path.join(directory, "degrees", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(Object.keys(degreeTypes)),
    acronym: z.string(),
  }),
  parser: (degree) => ({
    ...degree,
    type: degreeTypes[degree.type],
  }),
});

const programs = await getYamlData({
  path: path.join(directory, "programs", "*.yml"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    types: z.array(z.enum(Object.keys(programTypes))),
    degrees: z.array(z.enum(Object.keys(degrees))),
    acronym: z.string().optional(),
    tags: z.array(z.string()),
  }),
  parser: (program) => ({
    ...program,
    types: program.types.map((type) => programTypes[type]),
    degrees: program.degrees.map((degree) => degrees[degree]),
  }),
});

export async function getGraduateDegreeTypes() {
  return Object.values(degreeTypes);
}

export async function getGraduateProgramTypes() {
  return Object.values(programTypes);
}

export async function getGraduateDegrees() {
  return Object.values(degrees);
}

export async function getGraduatePrograms() {
  return Object.values(programs).sort((a, b) => a.name.localeCompare(b.name));
}
