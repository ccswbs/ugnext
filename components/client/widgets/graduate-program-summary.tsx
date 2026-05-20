import { FullGraduateProgramSummary } from "@/data/drupal/widgets";
import { GraduateProgramSummary } from "@/components/client/programs/graduate/graduate-program-summary";

export function GraduateProgramSummaryWidget({ data }: { data: FullGraduateProgramSummary }) {
  if (!data.program) {
    return <></>;
  }

  return <GraduateProgramSummary program={data.program} />;
}
