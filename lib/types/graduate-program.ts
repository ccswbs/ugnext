export type GraduateProgramApplicationDeadline = {
  location: "domestic" | "international";
  term: "fall" | "winter" | "spring";
  date: Date;
  showYear?: boolean;
};

export type GraduateProgramDuration = {
  type: "full-time" | "part-time";
  min: number;
  max?: number;
  programType?: string;
};

export type GraduateProgramAdmissionAverage = {
  minPercentage?: number;
  maxPercentage?: number;
  letterGrade?: string;
};

export type GraduateDegree = {
  id: string;
  name: string;
  acronym?: string;
};

export type GraduateProgram = {
  code: string;
  degree: GraduateDegree;
  type: string[];
  delivery: string[];
  average: GraduateProgramAdmissionAverage;
  duration: GraduateProgramDuration[];
  deadlines: GraduateProgramApplicationDeadline[];
};

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
