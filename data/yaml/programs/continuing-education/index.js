import path from "path";
import { getPrograms, getProgramTypes } from "@/data/yaml/programs";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "continuing-education");

export async function getContinuingEducationProgramTypes() {
  return await getProgramTypes(directory);
}

export async function getContinuingEducationPrograms() {
  return await getPrograms(directory);
}
