export type GraduateProgramApplicationDeadline = {
  location: "domestic" | "international";
  term: "fall" | "winter" | "spring";
  date: Date;
};

export type GraduateProgramDuration = {
  type: "full-time" | "part-time";
  min: number;
  max?: number;
  programType: string;
};

export type GraduateProgramAdmissionAverage = {
  details: string;
  minPercentage?: number;
  maxPercentage?: number;
  averageLetterGrade?: string;
};

export type GraduateProgram = {
  code: string;
  degree: string;
  type: string[];
  delivery: string;
  average: GraduateProgramAdmissionAverage;
  duration: GraduateProgramDuration[];
  deadlines: GraduateProgramApplicationDeadline[];
};
