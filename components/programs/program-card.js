import { Card } from "@/components/card";

export const ProgramCard = ({ program, showDegreesInFooter = false }) => {
  return (
    <Card
      href={program.url}
      key={program.id}
      title={
        <div className="flex flex-col gap-2 justify-center">
          <span className="text-lg font-bold">{program.name}</span>
          {program?.degrees?.map((degree, index) => (
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
  );
};
