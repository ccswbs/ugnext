import { Card } from "@/components/card";

export const ProgramGrid = ({ programs }) => {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {programs?.map((program) => (
        <Card
          href={program.url}
          key={program.id}
          title={
            <div className="flex flex-col gap-2 justify-center">
              <span className="text-lg font-bold">{program.name}</span>
              {!program.types.some((type) => type.id === "collaborative-specialization") &&
                program?.degrees?.map((degree, index) => (
                  <span key={degree.id} className="text-sm text-black/65">
                    {degree.acronym ? `${degree.name} - ${degree.acronym}` : degree.name}
                  </span>
                ))}
            </div>
          }
          footer={
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {program?.types?.map((type) => type.name).join(", ")}
            </span>
          }
        />
      ))}
    </div>
  );
};
