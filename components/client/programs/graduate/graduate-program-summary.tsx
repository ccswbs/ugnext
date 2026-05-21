import { GraduateProgram } from "@/lib/types/graduate-program";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import { toTitleCase } from "@/lib/string-utils";

export function GraduateProgramSummary({ program }: { program: GraduateProgram }) {
  const classes = tv({
    slots: {
      container: "p-4 w-full grid gap-4 grid-cols-1 md:grid-cols-3  bg-grey-dark-bg text-white",
      column: "flex flex-col gap-4",
      section: "flex flex-col gap-2",
      sectionTitle: "text-yellow-on-dark font-bold text-xl",
      sectionSubtitle: "font-bold pt-2",
      sectionList: "flex flex-col [&>li]:not-first:has-[ul]:pt-2",
    },
  });

  const { container, column, section, sectionTitle, sectionSubtitle, sectionList } = classes();

  const degree = program.degree.acronym ? `${program.degree.acronym} (${program.degree.name})` : program.degree.name;

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
    const date = item.ongoing
      ? "Ongoing"
      : new Date(item.date?.timestamp ?? "").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: item.date?.showYear ? "numeric" : undefined,
        });

    const value = `${toTitleCase(item.term)}: ${date}`;

    const existing = acc.get(item.location) ?? [];
    acc.set(item.location, [...existing, value]);

    return acc;
  }, new Map<string, string[]>());

  const duration = program.duration.reduce((acc, item) => {
    const range = item.min ? `${item.min} Months - ${item.max} Months` : `${item.max} Months`;
    const value = `${toTitleCase(item.type)}: ${range}`;

    const existing = acc.get(item.programType?.name ?? "") ?? [];
    acc.set(item.programType?.name ?? "", [...existing, value]);

    return acc;
  }, new Map<string, string[]>());

  const SectionMap = ({ data }: { data: Map<string, string[]> }) => {
    const noTitleItems = data.get("");

    return (
      <ul className={sectionList()}>
        {noTitleItems && noTitleItems.map((item) => <li key={item}>{item}</li>)}

        {data
          .entries()
          .toArray()
          .filter(([title]) => title != "")
          .map(([title, items]) => (
            <li key={title}>
              <h3 className={sectionSubtitle()}>{toTitleCase(title)}:</h3>

              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
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
              <li key={type.id}>{type.name}</li>
            ))}
          </ul>
        </div>

        {/* Degree Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Degree</h2>
          <span>{degree}</span>
        </div>

        {/* Delivery Section*/}
        <div className={section()}>
          <h2 className={sectionTitle()}>Delivery</h2>
          <ul className={sectionList()}>
            {program.delivery.map((value) => (
              <li key={value.id}>{value.name}</li>
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

          <SectionMap data={duration} />
        </div>
      </div>

      <div className={column()}>
        {/* Deadlines & Entry Terms Section */}
        <div className={section()}>
          <h2 className={sectionTitle()}>Deadlines & Entry Terms</h2>

          <SectionMap data={deadlines} />
        </div>
      </div>
    </Container>
  );
}
