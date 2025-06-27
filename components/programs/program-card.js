import { Card, CardContent, CardTitle, CardFooter } from "@uoguelph/react-components/card";

export const ProgramCard = ({ program }) => {
  return (
    <Card as="a" key={program.id} href={program.url} className="h-full">
      <CardContent className="flex-1 flex justify-center">
        <CardTitle>{program.name}</CardTitle>

        {program.degree && <span className="text-black/65">{program.degree.name}</span>}

        {program.degrees && (
          <span className="text-black/65">
            {program.degrees?.map((degree) => degree.acronym ?? degree.name).join(", ")}
          </span>
        )}
      </CardContent>

      <CardFooter>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {program?.types?.map((type) => type.name).join(", ")}
        </span>
      </CardFooter>
    </Card>
  );
};
