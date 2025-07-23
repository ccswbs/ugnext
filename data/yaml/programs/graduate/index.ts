import path from "path";
import { yaml, YAML_DATA_ROOT } from "@/data/yaml";

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
    type: DegreeType;
    acronym: string;
    types: DegreeType[];
  }

  export type Program = {
    __typename: "GraduateProgram";
    id: string;
    name: string;
    url: string;
    types: ProgramType[];
    degrees: Pick<Degree, "id" | "title">[];
    tags: string[];
  }
}

const GRADUATE_PROGRAMS_ROOT = path.join(YAML_DATA_ROOT, "graduate");
const GRADUATE_PROGRAMS_DEGREE_TYPES_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "degree-types");
const GRADUATE_PROGRAMS_PROGRAM_TYPES_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "program-types");
const GRADUATE_PROGRAMS_DEGREES_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "degrees");
const GRADUATE_PROGRAMS_PROGRAMS_ROOT = path.join(GRADUATE_PROGRAMS_ROOT, "programs");

export async function getGraduateDegreeTypes() {
  const types = [];

  for await (const type of yaml(path.join(GRADUATE_PROGRAMS_DEGREE_TYPES_ROOT, "*.yml"))) {
    if(!('name' in type.data)) {
      throw new Error(`Missing name field in ${type.path}`);
    }

    if(typeof type.data.name !== 'string') {
      throw new Error(`Invalid name field in ${type.path}, expected string, got ${typeof type.data.name}`);
    }

    types.push({
      id: type.filename,
      name: type.data.name,
    })
  }

  return types;
}

export async function getGraduatePrograms() {

}