import typesYaml from "./types.yml";
import degreesYaml from "./degrees.yml";
import degreeTypesYaml from "./degree-types.yml";
import programsYaml from "./programs.yml";
import { toMap } from "@/lib/array-utils";

export const getPrograms = async () => {
  // Create maps for types
  const types = toMap(typesYaml, "id");
  const degreeTypes = toMap(degreeTypesYaml, "id");

  // Process degrees to replace references to degree type
  const degrees = degreesYaml.map((degree) => {
    return {
      ...degree,
      types: degree.types.map((typeID) => {
        const type = degreeTypes.get(typeID);

        if (!type) {
          throw new Error(`The degree "${degree.name}" has a invalid degree type id: "${typeID}"`);
        }

        return type;
      }),
    };
  });

  // Create map for degrees
  const degreeMap = toMap(degrees, "id");

  // Process programs to replace type and degree references
  const programs = programsYaml.map((program) => ({
    ...program,
    types: program.types.map((typeID) => {
      const type = types.get(typeID);

      if (!type) {
        throw new Error(`The program "${program.name}" has a invalid type id: "${typeID}"`);
      }

      return type;
    }),
    degrees: program.degrees.map((degreeID) => {
      const degree = degreeMap.get(degreeID);

      if (!degree) {
        throw new Error(`The program "${program.name}" has a invalid degree id: "${degreeID}"`);
      }

      return {
        id: degree.id,
        name: degree.name,
        types: degree.types,
      };
    }),
  }));

  return programs.concat(degrees).sort((a, b) => a.name.localeCompare(b.name));
};
