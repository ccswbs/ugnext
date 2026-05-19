import { GraduateProgram } from "@/lib/types/graduate-program";

export const exampleProgram: GraduateProgram = {
  code: "MABS.ABSC",
  degree: {
    id: "mabs",
    name: "Master of Animal Biosciences",
    acronym: "MABS",
  },
  type: ["Coursework", "Major Research Paper/Project"],
  delivery: ["In-person"],
  average: {
    letterGrade: "B+",
    minPercentage: 75,
    maxPercentage: 80,
  },
  duration: [
    {
      type: "full-time",
      min: 12,
      max: 24,
      programType: "Coursework",
    },
    {
      type: "part-time",
      min: 24,
      max: 48,
      programType: "Major Research Paper/Project",
    },
    {
      type: "full-time",
      min: 12,
      max: 24,
    },
    {
      type: "part-time",
      min: 12,
      max: 24,
    },
    {
      type: "full-time",
      min: 24,
      max: 48,
      programType: "Major Research Paper/Project",
    },
  ],
  deadlines: [
    {
      location: "domestic",
      term: "fall",
      date: new Date("2026-02-01"),
    },
    {
      location: "international",
      term: "fall",
      date: new Date("2026-01-15"),
    },
    {
      location: "domestic",
      term: "winter",
      date: new Date("2026-09-01"),
    },
  ],
};

export function getGraduateProgramById(id: string): GraduateProgram | null {
  return exampleProgram;
}
