import path from "path";
import { getPrograms, getProgramTypes } from "@/data/yaml/programs";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "certificate-and-diploma");

export async function getCertificateAndDiplomaProgramTypes() {
  return await getProgramTypes(directory);
}

export async function getCertificateAndDiplomaPrograms() {
  return await getPrograms(directory);
}
