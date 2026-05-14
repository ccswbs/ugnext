import { GraduateProgram } from "@/lib/types/graduate-program";
import { tv } from "tailwind-variants";

export function ProgramRequirements({ program }: { program: GraduateProgram }) {
  const classes = tv({
    slots: {
      container: "p-4",
    },
  });

  const { container } = classes();

  return (
    <div className={container()}>
      <h2>Program Requirements</h2>
      <p>Placeholder content for program requirements.</p>
    </div>
  );
}
