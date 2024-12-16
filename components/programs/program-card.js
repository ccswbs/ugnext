import { Card } from "@/components/card";

const ProgramCardDegrees = ({ program, condensedDegrees = false }) => {
  return condensedDegrees ? (
    <span className="text-black/65">
      {program?.degrees?.map((degree, index) => degree.acronym ?? degree.name).join(", ")}
    </span>
  ) : (
    program?.degrees?.map((degree, index) => (
      <span key={degree.id} className="text-black/65">
        {degree.name}
      </span>
    ))
  );
};

export const ProgramCard = ({ program, condensedDegrees = false }) => {
  const isCollaborativeSpecialization = program.types.some((type) => type.id === "collaborative-specialization");
  const showDegrees = Array.isArray(program.degrees) && !isCollaborativeSpecialization;

  return (
    <Card
      href={program.url}
      key={program.id}
      title={
        <div className="flex flex-col gap-2 justify-center">
          <span className="text-lg font-bold">{program.name}</span>
          {showDegrees && <ProgramCardDegrees program={program} condensedDegrees={condensedDegrees} />}
        </div>
      }
      footer={
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {program?.types?.map((type) => type.name).join(", ")}
        </span>
      }
    />
  );
};
