import { FullGraduateProgramSummary } from "@/data/drupal/widgets";
import { GraduateProgramSummary } from "@/components/client/programs/graduate/graduate-program-summary";

export function GraduateProgramSummaryWidget({ data }: { data: FullGraduateProgramSummary }) {
  if (!data.program || data.program?.status === false) {
    return <></>;
  }

  return <GraduateProgramSummary program={data.program} />;
}
