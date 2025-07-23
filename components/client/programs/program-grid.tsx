import { Program, ProgramCard } from "./program-card";
import { Grid } from "@uoguelph/react-components/grid";

export function ProgramGrid({
  programs,
  useDegreeAcronym = false,
}: {
  programs: Program[];
  useDegreeAcronym?: boolean;
}) {
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
