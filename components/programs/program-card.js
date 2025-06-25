import { Card } from "@/components/card";

export const ProgramCard = ({ program }) => {
  return (
    <Card
      href={program.url}
      key={program.id}
      title={
        <div className="flex flex-col gap-2 justify-center">
          <span className="text-uog-color-black text-lg font-bold">{program.name}</span>

          {program.degree && <span className="text-uog-color-black/65">{program.degree.name}</span>}

          {program.degrees && (
            <span className="text-uog-color-black/65">
              {program.degrees?.map((degree) => degree.acronym ?? degree.name).join(", ")}
            </span>
          )}
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
