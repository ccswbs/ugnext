import path from "path";
import { getDegrees, getDegreeTypes, getPrograms, getProgramTypes } from "@/data/yaml/programs";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "graduate");

export async function getGraduateDegreeTypes() {
  return await getDegreeTypes(directory);
}

export async function getGraduateProgramTypes() {
  return await getProgramTypes(directory);
}

export async function getGraduateDegrees() {
  return await getDegrees(directory);
}

export async function getGraduatePrograms() {
  return await getPrograms(directory);
}
