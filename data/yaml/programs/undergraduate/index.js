import path from "path";
import { z } from "zod";
import { getYamlData } from "@/lib/file-utils";

const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

export async function getUndergraduateDegreeTypes() {
  return await getYamlData({
    id: "undergraduate-degree-types",
    path: path.join(directory, "degree-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateProgramTypes() {
  return await getYamlData({
    id: "undergraduate-program-types",
    path: path.join(directory, "program-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateStudentTypes() {
  return await getYamlData({
    id: "undergraduate-student-types",
    path: path.join(directory, "student-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateAdmissionLocations() {
  return await getYamlData({
    id: "undergraduate-admission-locations",
    path: path.join(directory, "locations.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["domestic", "international", "curriculum"]),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

export async function getUndergraduateAdmissionRequirementSectionTypes() {
  return await getYamlData({
    id: "undergraduate-admission-requirement-section-types",
    path: path.join(directory, "admission-requirement-section-types.yml"),
    schema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["text", "list"]),
      })
    ),
    postProcessor: (data) => data.flat(),
  });
}

async function getAdmissionRequirementsSchema() {
  const studentTypes = await getUndergraduateStudentTypes();
  const locations = await getUndergraduateAdmissionLocations();
  const admissionRequirementSectionTypes = await getUndergraduateAdmissionRequirementSectionTypes();

  const studentTypeSchema = z
    .enum(studentTypes.map((type) => type.id))
    .transform((value) => studentTypes.find((type) => type.id === value));

  const locationSchema = z
    .enum([...locations.map((location) => location.id), "domestic", "international", "curriculum"])
    .transform((value) => {
      switch (value) {
        case "domestic":
        case "international":
        case "curriculum":
          return locations.filter((location) => location.type === value) ?? null;
        default:
          return locations.find((location) => location.id === value) ?? null;
      }
    });

  return z
    .array(
      z.object({
        "student-types": z
          .union([studentTypeSchema, z.array(studentTypeSchema)])
          .nullable()
          .transform((value) => (typeof value === "string" ? [value] : (value ?? studentTypes))),
        locations: z
          .union([locationSchema, z.array(locationSchema)])
          .nullable()
          .transform((value) => (typeof value === "string" ? [value] : (value?.flat() ?? locations))),
        sections: z.object(
          admissionRequirementSectionTypes.reduce((acc, type) => {
            acc[type.id] = z
              .union([z.string(), z.array(z.string())])
              .nullish()
              .transform((value) => (typeof value === "string" ? [value] : value));
            return acc;
          }, {})
        ),
      })
    )
    .nullish();
}

export async function getUndergraduateDegrees() {
  const degreeTypes = await getUndergraduateDegreeTypes();

  return await getYamlData({
    id: "undergraduate-degrees",
    path: path.join(directory, "degrees", "*.yml"),
    listen: path.join(directory, "*.yml"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      type: z
        .enum(degreeTypes.map((type) => type.id))
        .transform((value) => degreeTypes.find((type) => type.id === value)),
      acronym: z.string(),
      tags: z.array(z.string()),
      requirements: await getAdmissionRequirementsSchema(),
    }),
    postProcessor: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}

export async function getUndergraduatePrograms() {
  const programTypes = await getUndergraduateProgramTypes();
  const degrees = await getUndergraduateDegrees();

  return await getYamlData({
    id: "undergraduate-programs",
    path: path.join(directory, "programs", "*.yml"),
    listen: `{${path.join(directory, "degrees", "**", "*.yml")},${path.join(directory, "*.yml")}}`,
    schema: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      types: z.array(
        z.enum(programTypes.map((type) => type.id)).transform((value) => programTypes.find((type) => type.id === value))
      ),
      degree: z
        .enum(degrees.map((degree) => degree.id))
        .nullish()
        .transform((value) => degrees.find((degree) => degree.id === value) ?? null),
      acronym: z.string().optional(),
      tags: z.array(z.string()),
      "alternative-offers": z.array(z.string()).nullish(),
      requirements: await getAdmissionRequirementsSchema(),
    }),
    postProcessor: (data) => {
      return data
        .map((program) => {
          const alternativeOffers = program["alternative-offers"]?.map((alt, index) => {
            const altProgram = data.find((program) => program.id === alt);

            if (!altProgram) {
              throw new Error(
                `In program ${program.name}: alternative offer ${alt} at index ${index} is not a valid program`
              );
            }

            return altProgram;
          });

          return { ...program, "alternative-offers": alternativeOffers };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

export async function parseAdmissionRequirementsSlug(slug) {
  const studentTypes = await getUndergraduateStudentTypes();
  const studentType = studentTypes.find((type) => type.id === slug[0]);

  if (!studentType) {
    return {
      studentType: null,
      location: null,
      program: null,
    };
  }

  const locations = await getUndergraduateAdmissionLocations();
  const location = locations.find((location) => location.id === slug[1]);

  if (!location) {
    return {
      studentType: studentType,
      location: null,
      program: null,
    };
  }

  const programs = await getUndergraduatePrograms();
  let program = programs.find((program) => program.id === slug[2]);

  if (!program) {
    const degrees = await getUndergraduateDegrees();
    program = degrees.find((degree) => degree.id === slug[2]) ?? null;
  }

  return {
    studentType: studentType,
    location: location,
    program: program,
  };
}

export async function getUndergraduateRequirements(studentType, location, program) {
  const degreeRequirements = program.degree?.requirements ?? [];
  const programRequirements = program.requirements ?? [];
  const requirements = [...degreeRequirements, ...programRequirements].filter((requirement) => {
    const matchesStudentType = requirement["student-types"].find((type) => type.id === studentType.id);
    const matchesLocation = requirement.locations.find((l) => l.id === location.id);

    return matchesStudentType && matchesLocation;
  });

  const admissionRequirementSectionTypes = await getUndergraduateAdmissionRequirementSectionTypes();

  const sections = admissionRequirementSectionTypes.reduce((acc, section) => {
    acc[section.id] = {
      ...section,
      content: [],
    };
    return acc;
  }, {});

  for (const requirement of requirements) {
    for (const section in requirement.sections) {
      sections[section].content = requirement.sections[section] ?? [];
    }
  }

  const hasAverage = sections["cut-off"].content.length > 0;
  const isCoop = program.types?.some((type) => type.id === "co-op");

  // Below are special cases where we will manually add information to the requirement sections.

  if (studentType.id === "college") {
    sections["notes"].content.push(
      "Only applicants who have completed a minimum of one year of study in an appropriate two or three-year college diploma will be considered for admission."
    );
  }

  if (studentType.id === "university") {
    sections["notes"].content.push(
      "Only applicants who have completed a minimum of 2.0 credits of study will be considered for admission. Those with less than 2.0 completed credits are typically considered for fall entry only"
    );
  }

  if (studentType.id === "internal") {
    sections["notes"].content.push(
      "Only applicants who have completed a minimum of 2.0 credits of study will be eligible for transfer."
    );

    sections["notes"].content.push(
      "If you have previously been required to withdraw from the U of G, please contact Admission Services at <a href='mailto:admission@uoguelph.ca'>admission@uoguelph.ca</a> for more information."
    );
  }

  if (isCoop) {
    if (studentType.id === "high-school") {
      sections["notes"].content.push(
        "This program is offered with and without co-op. Students not admissible to co-op will be automatically considered for the regular program."
      );
    } else {
      sections["notes"].content.push(
        "This program is offered with and without co-op. Transfer students are not eligible for direct entry into co-op. Those who apply for co-op will be considered for the regular program. Once you are enrolled in your program you can connect with your Program Counselor to determine whether you are eligible for co-op. For more information, contact <a href='https://www.uoguelph.ca/experientiallearning/'>Experiential Learning</a>"
      );
    }
  }

  if (hasAverage && studentType.id === "high-school") {
    sections["notes"].content.push(
      "Estimated cutoff ranges are based on admission averages from previous years and are provided as a point of reference. Exact cut-offs are determined by the quantity and quality of applications received and the space available in the program. Having an average within this range does not guarantee admission."
    );

    if (isCoop) {
      sections["notes"].content.push("Co-op averages will often exceed the estimated cut-off ranges.");
    }
  }

  if (program["alternative-offers"]?.length > 0) {
    sections["notes"].content.push(
      `Students not admissible to this program will automatically be considered for ${program["alternative-offers"].map((program) => `<a href="${program.url}">${program.name}</a>`).join(", ")}. Learn more about <a href="https://www.uoguelph.ca/admission/undergraduate/apply/alternate">Alternate Offers</a>.`
    );
  }

  if (program["fully-online"]) {
    sections["notes"].content.push(
      "This program is pending Senate approval and is offered fully online. Students enrolled in the online program cannot take in-person courses."
    );
  }

  return Object.values(sections);
}
