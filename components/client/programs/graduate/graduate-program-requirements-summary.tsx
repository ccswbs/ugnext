import {
  GraduateProgram,
  GraduateProgramAdmissionAverage,
  GraduateProgramApplicationDeadline,
} from "@/lib/types/graduate-program";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import { toTitleCase } from "@uoguelph/react-components";

export function GraduateProgramRequirementsSummary({ program }: { program: GraduateProgram }) {
  const classes = tv({
    slots: {
      container: "p-4 w-full grid gap-4 grid-cols-1 md:grid-cols-3  bg-grey-dark-bg text-white",
      column: "flex flex-col gap-4",
      section: "flex flex-col gap-2",
      sectionTitle: "text-yellow-on-dark font-bold text-xl",
      sectionSubtitle: "font-bold",
      sectionList: "flex flex-col has-[ul]:gap-4",
    },
  });

  const { container, column, section, sectionTitle, sectionSubtitle, sectionList } = classes();

  const average = (() => {
    const { letterGrade, minPercentage, maxPercentage } = program.average;

    const hasMin = minPercentage !== undefined;
    const hasMax = maxPercentage !== undefined;

    let percentageText = "";

    if (hasMin && hasMax) {
      percentageText = `${minPercentage}% - ${maxPercentage}%`;
    } else if (hasMin) {
      percentageText = `${minPercentage}%`;
    } else if (hasMax) {
      percentageText = `${maxPercentage}%`;
    }

    if (letterGrade && percentageText) {
      return `${letterGrade} (${percentageText})`;
    }

    return letterGrade || percentageText || "";
  })();

  const deadlines = program.deadlines.reduce((acc, item) => {
    const deadlineStr = `${toTitleCase(item.term)}: ${item.date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: item.showYear ? "numeric" : undefined,
    })}`;

    const existing = acc.get(item.location) ?? [];
    acc.set(item.location, [...existing, deadlineStr]);

    return acc;
  }, new Map<string, string[]>());

  const duration = program.duration.reduce((acc, item) => {
    return acc;
  }, new Map<string, string[]>());

  const renderMap = (map: Map<string, string[]>) => {
    return (
      <ul className={sectionList()}>
        {map
          .entries()
          .toArray()
          .map(([title, items]) => (
            <li>
              <h3 className={sectionSubtitle()}>{toTitleCase(title)}:</h3>

              <ul>
                {items.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <Container className={container()}>
      <div className={column()}>
        {/* Program Type Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Program Type</h2>
          <ul className={sectionList()}>
            {program.type.map((type) => (
              <li>{type}</li>
            ))}
          </ul>
        </div>

        {/* Degree Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Degree</h2>
          <span>
            {program.degree.acronym ? `${program.degree.acronym} (${program.degree.name})` : program.degree.name}
          </span>
        </div>

        {/* Delivery Section*/}
        <div className={section()}>
          <h2 className={sectionTitle()}>Delivery</h2>
          <ul className={sectionList()}>
            {program.delivery.map((value) => (
              <li>{value}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={column()}>
        {/* Admission Average Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Admission Average</h2>
          <span>{average}</span>
        </div>

        {/* Duration Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Duration</h2>

          {renderMap(duration)}
        </div>
      </div>

      <div className={column()}>
        {/* Deadlines & Entry Terms Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Deadlines & Entry Terms</h2>

          {renderMap(deadlines)}
        </div>
      </div>
    </Container>
  );
}
