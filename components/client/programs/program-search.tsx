"use client";

import { useState } from "react";
import { Container } from "@uoguelph/react-components/container";
import { Card, CardContent, CardTitle, CardFooter } from "@uoguelph/react-components/card";
import { tv } from "tailwind-variants";
import type { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import type { UndergraduateDegree } from "@/data/drupal/undergraduate-degree";
import type { GraduateProgram } from "@/data/yaml/programs/graduate";
import type { CertificateAndDiplomaProgram } from "@/data/yaml/programs/certificate-and-diploma";
import type { ContinuingEducationProgram } from "@/data/yaml/programs/continuing-education";
import type { UndergraduateProgramType } from "@/data/drupal/undergraduate-program";
import type { GraduateDegreeType, GraduateProgramType } from "@/data/yaml/programs/graduate";
import type { CertificateAndDiplomaProgramType } from "@/data/yaml/programs/certificate-and-diploma";
import type { ContinuingEducationProgramType } from "@/data/yaml/programs/continuing-education";
import type { UndergraduateDegreeType } from "@/data/drupal/undergraduate-degree";
import { Grid } from "@uoguelph/react-components/grid";
import { usePathname } from "next/navigation";
import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import Link from "next/link";

export type ProgramType =
  | UndergraduateProgramType
  | UndergraduateDegreeType
  | GraduateProgramType
  | CertificateAndDiplomaProgramType
  | ContinuingEducationProgramType;

export type DegreeType = UndergraduateDegreeType | GraduateDegreeType;

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

type ProgramCardProps = {
  program: Program;
  useDegreeAcronym?: boolean;
};

function ProgramCard({ program, useDegreeAcronym = false }: ProgramCardProps) {
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

type ProgramGridProps = {
  programs: Program[];
  useDegreeAcronym?: boolean;
};

function ProgramGrid({ programs, useDegreeAcronym = false }: ProgramGridProps) {
  return (
    <Grid
      template={{
        base: ["minmax(0, 1fr)"],
        md: Array(2).fill("minmax(0, 1fr)"),
        lg: Array(3).fill("minmax(0, 1fr)"),
        xl: Array(4).fill("minmax(0, 1fr)"),
      }}
      gap={{
        x: 14,
        y: 14,
      }}
      alignment={{
        x: "stretch",
        y: "stretch",
      }}
    >
      {programs?.map((program) => (
        <ProgramCard key={program.id} program={program} useDegreeAcronym={useDegreeAcronym} />
      ))}
    </Grid>
  );
}

export const ProgramSearchNavigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/programs/undergraduate", label: "Undergraduate Programs" },
    { href: "/programs/graduate", label: "Graduate Programs" },
    { href: "/programs/certificate-and-diploma", label: "Certificate and Diplomas" },
    { href: "/programs/continuing-education", label: "Pre & Post University" },
  ];

  return (
    <Navigation>
      {links.map((link) => (
        <NavigationLink key={link.href} href={link.href} active={pathname === link.href} as={Link}>
          {link.label}
        </NavigationLink>
      ))}
    </Navigation>
  );
};

type ProgramSearchProps = {
  programs: Program[];
  types: ProgramType[];
  degreeTypes?: DegreeType[];
  useDegreeAcronym?: boolean;
};

export const ProgramSearch = ({ programs, types, degreeTypes, useDegreeAcronym = false }: ProgramSearchProps) => {
  const [filtered, setFiltered] = useState(programs);

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
        <ProgramSearchNavigation />
      </Container>

      <Container>
        <ProgramGrid programs={filtered} useDegreeAcronym={useDegreeAcronym} />

        {/* No results were found */}
        {filtered?.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl font-bold text-black/50">No programs matching your criteria were found.</span>
          </div>
        )}
      </Container>
    </div>
  );
};
