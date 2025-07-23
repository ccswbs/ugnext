import path from "path";
import { yaml, YAML_DATA_ROOT } from "@/data/yaml";
import { glob } from "glob";

namespace GraduatePrograms {
  export type DegreeType = {
    __typename: "GraduateDegreeType";
    id: string;
    name: string;
  }

  export type ProgramType = {
    __typename: "GraduateProgramType";
    id: string;
    name: string;
  }

  export type Degree = {
    __typename: "GraduateDegree";
    id: string;
    title: string;
    acronym: string;
    type: DegreeType;
  }

  export type Program = {
    __typename: "GraduateProgram";
    id: string;
    title: string;
    url: string;
    types: ProgramType[];
    degrees: Pick<Degree, "id" | "title" | "__typename">[];
    tags: string[];
  }
}

const GRADUATE_PROGRAMS_ROOT = path.join(YAML_DATA_ROOT, "programs", "graduate");
const GRADUATE_PROGRAMS_DEGREE_TYPES_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "degree-types");
const GRADUATE_PROGRAMS_PROGRAM_TYPES_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "program-types");
const GRADUATE_PROGRAMS_DEGREES_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "degrees");
const GRADUATE_PROGRAMS_PROGRAMS_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "programs");

export async function getGraduateDegreeType(filepath: string) {
  const degreeType = await yaml(filepath);

  if(!('name' in degreeType.data)) {
    throw new Error(`Missing name field in ${degreeType.path}`);
  }

  if(typeof degreeType.data.name !== 'string') {
    throw new Error(`Invalid name field in ${degreeType.path}, expected string, got ${typeof degreeType.data.name}`);
  }

  return {
    __typename: "GraduateDegreeType",
    id: degreeType.filename,
    name: degreeType.data.name,
  } as GraduatePrograms.DegreeType;
}

export async function getGraduateDegreeTypes() {
  const paths = await glob(path.join(GRADUATE_PROGRAMS_DEGREE_TYPES_ROOT, "*.yml"));
  const degreeTypes = await Promise.all(paths.map((path) => getGraduateDegreeType(path)));

  return degreeTypes.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getGraduateProgramType(filepath: string) {
  const programType = await yaml(filepath);

  if(!('name' in programType.data)) {
    throw new Error(`Missing name field in ${programType.path}`);
  }

  if(typeof programType.data.name !== 'string') {
    throw new Error(`Invalid name field in ${programType.path}, expected string, got ${typeof programType.data.name}`);
  }

  return {
    __typename: "GraduateProgramType",
    id: programType.filename,
    name: programType.data.name,
  } as GraduatePrograms.ProgramType;
}

export async function getGraduateProgramTypes() {
  const paths = await glob(path.join(GRADUATE_PROGRAMS_PROGRAM_TYPES_ROOT, "*.yml"));
  const programTypes = await Promise.all(paths.map((path) => getGraduateProgramType(path)));

  return programTypes.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getGraduateDegree(filepath: string) {
  const degree = await yaml(filepath);

  if(!('name' in degree.data)) {
    throw new Error(`Missing name field in ${degree.path}`);
  }

  if(typeof degree.data.name !== 'string') {
    throw new Error(`Invalid name field in ${degree.path}, expected string, got ${typeof degree.data.name}`);
  }

  if(typeof degree.data.acronym !== 'string' && typeof degree.data.acronym !== 'undefined') {
    throw new Error(`Invalid acronym field in ${degree.path}, expected string or undefined, got ${typeof degree.data.acronym}`);
  }

  // Parse type field
  if(!('type' in degree.data)) {
    throw new Error(`Missing type field in ${degree.path}`);
  }

  if(typeof degree.data.type !== 'string') {
    throw new Error(`Invalid type field in ${degree.path}, expected string, got ${typeof degree.data.types}`);
  }

  let degreeType: GraduatePrograms.DegreeType;

  try {
    degreeType = await getGraduateDegreeType(path.join(GRADUATE_PROGRAMS_DEGREE_TYPES_ROOT, `${degree.data.type}.yml`));
  } catch(e) {
    throw new Error(`Invalid type in types field in ${degree.path}, no such degree type: ${degree.data.type}`);
  }

  return {
    __typename: "GraduateDegree",
    id: degree.filename,
    title: degree.data.name,
    acronym: degree.data.acronym,
    type: degreeType,
  } as GraduatePrograms.Degree;
}

export async function getGraduateDegrees() {
  const paths = await glob(path.join(GRADUATE_PROGRAMS_DEGREES_ROOT, "*.yml"));
  const degrees = await Promise.all(paths.map((path) => getGraduateDegree(path)));

  return degrees.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getGraduateProgram(filepath: string) {
  const program = await yaml(filepath);

  if(!('name' in program.data)) {
    throw new Error(`Missing name field in ${program.path}`);
  }

  if(typeof program.data.name !== 'string') {
    throw new Error(`Invalid name field in ${program.path}, expected string, got ${typeof program.data.name}`);
  }

  if(!('url' in program.data)) {
    throw new Error(`Missing url field in ${program.path}`);
  }

  if(typeof program.data.url !== 'string') {
    throw new Error(`Invalid url field in ${program.path}, expected string, got ${typeof program.data.url}`);
  }

  if(!('tags' in program.data)) {
    throw new Error(`Missing tags field in ${program.path}`);
  }

  if(!Array.isArray(program.data.tags)) {
    throw new Error(`Invalid tags field in ${program.path}, expected array, got ${typeof program.data.tags}`);
  }

  // Parse types field
  if(!('types' in program.data)) {
    throw new Error(`Missing types field in ${program.path}`);
  }

  if(!Array.isArray(program.data.types)) {
    throw new Error(`Invalid types field in ${program.path}, expected array, got ${typeof program.data.types}`);
  }

  if(program.data.types.length === 0) {
    throw new Error(`Invalid types field in ${program.path}, expected at least one type, got ${program.data.types.length}`);
  }

  const programTypes: GraduatePrograms.ProgramType[] = [];

  for(const type of program.data.types) {
    try {
      programTypes.push(await getGraduateProgramType(path.join(GRADUATE_PROGRAMS_PROGRAM_TYPES_ROOT, `${type}.yml`)));
    } catch(e) {
      throw new Error(`Invalid type in types field in ${program.path}, no such program type: ${type}`);
    }
  }

  // Parse degrees

  if(!('degrees' in program.data)) {
    throw new Error(`Missing degrees field in ${program.path}`);
  }

  if(!Array.isArray(program.data.degrees)) {
    throw new Error(`Invalid degrees field in ${program.path}, expected array, got ${typeof program.data.degrees}`);
  }

  if(program.data.degrees.length === 0) {
    throw new Error(`Invalid degrees field in ${program.path}, expected at least one degree, got ${program.data.degrees.length}`);
  }

  const degrees: GraduatePrograms.Program["degrees"] = [];

  for(const degree of program.data.degrees) {
    try {
      const fullDegree = await getGraduateDegree(path.join(GRADUATE_PROGRAMS_DEGREES_ROOT, `${degree}.yml`));

      degrees.push({
        __typename: fullDegree.__typename,
        id: fullDegree.id,
        title: fullDegree.title,
      });
    } catch(e) {
      throw new Error(`Invalid degree in degrees field in ${program.path}, no such degree: ${degree}`);
    }
  }

  return {
    __typename: "GraduateProgram",
    id: program.filename,
    title: program.data.name,
    url: program.data.url,
    types: programTypes,
    degrees: degrees,
    tags: program.data.tags,
  } as GraduatePrograms.Program;
}

export async function getGraduatePrograms() {
  const paths = await glob(path.join(GRADUATE_PROGRAMS_PROGRAMS_ROOT, "*.yml"));
  const programs = await Promise.all(paths.map((path) => getGraduateProgram(path)));

  return programs.sort((a, b) => a.title.localeCompare(b.title));
}