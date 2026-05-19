export type GraduateProgramType = {
  id: string;
  name: string;
};

export type GraduateDegree = {
  id: string;
  name: string;
  acronym?: string;
};

export type GraduateProgramApplicationDeadline = {
  location: string;
  term: string;
  date: string;
  showYear?: boolean;
};

export type GraduateProgramDuration = {
  type: string;
  min?: number;
  max: number;
  programType?: GraduateProgramType;
};

export type GraduateProgramAdmissionAverage = {
  minPercentage?: number;
  maxPercentage?: number;
  letterGrade?: string;
};

export type GraduateProgram = {
  code: string;
  degree: GraduateDegree;
  type: GraduateProgramType[];
  delivery: string[];
  average: GraduateProgramAdmissionAverage;
  duration: GraduateProgramDuration[];
  deadlines: GraduateProgramApplicationDeadline[];
};
