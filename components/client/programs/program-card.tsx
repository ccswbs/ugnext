import { Card, CardContent, CardTitle, CardFooter } from "@uoguelph/react-components/card";
import { tv } from "tailwind-variants";
import type { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type { UndergraduateDegree } from "@/data/drupal/undergraduate-degree";
import type { GraduateProgram } from "@/data/yaml/programs/graduate";
import type { CertificateAndDiplomaProgram } from "@/data/yaml/programs/certificate-and-diploma";
import type { ContinuingEducationProgram } from "@/data/yaml/programs/continuing-education";

export type Program =
  | UndergraduateProgram
  | UndergraduateDegree
  | GraduateProgram
  | CertificateAndDiplomaProgram
  | ContinuingEducationProgram;

function getProgramUrl(program: Program) {
  if (typeof program.url === "string") {
    return program.url;
  }

  if (typeof program.url === "object") {
    return program.url.url ?? null;
  }

  return null;
}

function getProgramDegrees(program: Program) {
  if (program.__typename === "NodeUndergraduateProgram" && program.degree) {
    return [program.degree];
  }

  if (program.__typename === "GraduateProgram") {
    return program.degrees;
  }

  return null;
}

export function ProgramCard({ program, useDegreeAcronym = false }: { program: Program; useDegreeAcronym?: boolean }) {
  const url = getProgramUrl(program);
  const degrees = getProgramDegrees(program);

  const styles = tv({
    slots: {
      card: "h-full hover:scale-105 transition-transform",
      content: "flex-1 flex justify-center",
      degrees: "flex flex-wrap gap-2",
      degree: "text-black/65",
      footer: "overflow-hidden text-ellipsis whitespace-nowrap",
    },
  })();

  return (
    <Card as={url ? "a" : "div"} key={program.id} href={url ? url : undefined} className={styles.card()}>
      <CardContent className={styles.content()}>
        <CardTitle>{program.title}</CardTitle>

        <div className={styles.degrees()}>
          {degrees?.map((degree) => (
            <span key={degree.id} className="text-black/65">
              {degree.__typename === "GraduateDegree" && useDegreeAcronym ? degree.acronym : degree.title}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <span className={styles.footer()}>
          {Array.isArray(program.type) ? program.type.map((type) => type.name).join(", ") : program.type.name}
        </span>
      </CardFooter>
    </Card>
  );
}
