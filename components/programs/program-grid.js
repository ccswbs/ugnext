import { ProgramCard } from "@/components/programs/program-card";

export const ProgramGrid = ({ programs, condensedDegrees = false }) => {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {programs?.map((program) => (
        <ProgramCard key={program.id} program={program} condensedDegrees={condensedDegrees} />
      ))}
    </div>
  );
};
