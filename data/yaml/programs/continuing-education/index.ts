import path from "path";
import { yaml, YAML_DATA_ROOT } from "@/data/yaml";
import { glob } from "glob";

export type ContinuingEducationProgramType = {
  __typename: "ContinuingEducationProgramType";
  id: string;
  name: string;
};

export type ContinuingEducationProgram = {
  __typename: "ContinuingEducationProgram";
  id: string;
  title: string;
  url: string;
  types: ContinuingEducationProgramType[];
  tags: string[];
};

const CONTINUING_EDUCATION_ROOT = path.join(YAML_DATA_ROOT, "programs", "continuing-education");
const CONTINUING_EDUCATION_PROGRAM_TYPES_ROOT = path.join(CONTINUING_EDUCATION_ROOT, "program-types");
const CONTINUING_EDUCATION_PROGRAMS_ROOT = path.join(CONTINUING_EDUCATION_ROOT, "programs");

export async function getContinuingEducationProgramType(filepath: string) {
  const programType = await yaml(filepath);

  if (!("name" in programType.data)) {
    throw new Error(`Missing name field in ${programType.path}`);
  }

  if (typeof programType.data.name !== "string") {
    throw new Error(`Invalid name field in ${programType.path}, expected string, got ${typeof programType.data.name}`);
  }

  return {
    __typename: "ContinuingEducationProgramType",
    id: programType.filename,
    name: programType.data.name,
  } as ContinuingEducationProgramType;
}

export async function getContinuingEducationProgramTypes() {
  const paths = await glob(path.join(CONTINUING_EDUCATION_PROGRAM_TYPES_ROOT, "*.yml"));
  const programTypes = await Promise.all(paths.map((path) => getContinuingEducationProgramType(path)));

  return programTypes.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getContinuingEducationProgram(filepath: string) {
  const program = await yaml(filepath);

  if (!("name" in program.data)) {
    throw new Error(`Missing name field in ${program.path}`);
  }

  if (typeof program.data.name !== "string") {
    throw new Error(`Invalid name field in ${program.path}, expected string, got ${typeof program.data.name}`);
  }

  if (!("url" in program.data)) {
    throw new Error(`Missing url field in ${program.path}`);
  }

  if (typeof program.data.url !== "string") {
    throw new Error(`Invalid url field in ${program.path}, expected string, got ${typeof program.data.url}`);
  }

  if (!("tags" in program.data)) {
    throw new Error(`Missing tags field in ${program.path}`);
  }

  if (!Array.isArray(program.data.tags)) {
    throw new Error(`Invalid tags field in ${program.path}, expected array, got ${typeof program.data.tags}`);
  }

  // Parse types field
  if (!("types" in program.data)) {
    throw new Error(`Missing types field in ${program.path}`);
  }

  if (!Array.isArray(program.data.types)) {
    throw new Error(`Invalid types field in ${program.path}, expected array, got ${typeof program.data.types}`);
  }

  if (program.data.types.length === 0) {
    throw new Error(
      `Invalid types field in ${program.path}, expected at least one type, got ${program.data.types.length}`
    );
  }

  const programTypes: ContinuingEducationProgramType[] = [];

  for (const type of program.data.types) {
    try {
      programTypes.push(
        await getContinuingEducationProgramType(path.join(CONTINUING_EDUCATION_PROGRAM_TYPES_ROOT, `${type}.yml`))
      );
    } catch (e) {
      throw new Error(`Invalid type in types field in ${program.path}, no such program type: ${type}`);
    }
  }

  return {
    __typename: "ContinuingEducationProgram",
    id: program.filename,
    title: program.data.name,
    url: program.data.url,
    types: programTypes,
    tags: program.data.tags,
  } as ContinuingEducationProgram;
}

export async function getContinuingEducationPrograms() {
  const paths = await glob(path.join(CONTINUING_EDUCATION_PROGRAMS_ROOT, "*.yml"));
  const programs = await Promise.all(paths.map((path) => getContinuingEducationProgram(path)));

  return programs.sort((a, b) => a.title.localeCompare(b.title));
}
