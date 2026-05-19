import { GraduateProgram, GraduateProgramAdmissionAverage } from "@/lib/types/graduate-program";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import { toTitleCase } from "@uoguelph/react-components";

type GraduateProgramRequirementsCategoryItem =
  | {
      title: string;
      items: string[];
    }
  | string;

export function GraduateProgramRequirementsCategory({
  title,
  items,
}: {
  title: string;
  items: GraduateProgramRequirementsCategoryItem[];
}) {
  const classes = tv({
    slots: {
      category: "",
      categoryTitle: "text-lg font-bold text-yellow-on-dark",
      categorySubtitle: "block font-bold text-white group-not-first-of-type:pt-4",
      categoryList: "group flex flex-col",
      categoryListItem: "not-first:has-[ul]:pt-4",
    },
  });

  const { category, categoryTitle, categorySubtitle, categoryList, categoryListItem } = classes();

  return (
    <div className={category()}>
      <h2 className={categoryTitle()}>{title}</h2>
      <ul className={categoryList()}>
        {items.map((type) => {
          if (typeof type === "string") {
            return (
              <li key={type} className={categoryListItem()}>
                {type}
              </li>
            );
          }

          return (
            <li key={type.title} className={categoryListItem()}>
              <span className={categorySubtitle()}>{type.title}</span>
              <ul className={categoryList()}>
                {type.items.map((item) => (
                  <li key={item} className={categoryListItem()}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function GraduateProgramRequirementsSummary({ program }: { program: GraduateProgram }) {
  const classes = tv({
    slots: {
      container: "p-4 w-full grid gap-4 grid-cols-1 md:grid-cols-3  bg-grey-dark-bg text-white",
      column: "flex flex-col gap-4",
    },
  });

  const { container, column } = classes();

  const parseDuration = (duration: GraduateProgram["duration"]) => {
    const programTypeMap = new Map<string, string[]>();

    for (const entry of duration) {
      const existing = programTypeMap.get(entry.programType);
      const strValue = `${toTitleCase(entry.type)}: ${entry.min}${entry.max ? ` - ${entry.max}` : ""} Months`;

      if (existing) {
        programTypeMap.set(entry.programType, [...existing, strValue]);
      } else {
        programTypeMap.set(entry.programType, [strValue]);
      }
    }

    return programTypeMap
      .entries()
      .map((entry) => ({
        title: toTitleCase(entry[0]) + ":",
        items: entry[1],
      }))
      .toArray();
  };

  const parseDeadlines = (deadlines: GraduateProgram["deadlines"]) => {
    const locationMap = new Map<string, string[]>();

    for (const deadline of deadlines) {
      const existing = locationMap.get(deadline.location);
      const fullFormattedStr = `${toTitleCase(deadline.term)}: ${deadline.date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: deadline.showYear ? "numeric" : undefined,
      })}`;

      if (existing) {
        locationMap.set(deadline.location, [...existing, fullFormattedStr]);
      } else {
        locationMap.set(deadline.location, [fullFormattedStr]);
      }
    }

    return locationMap
      .entries()
      .map((entry) => ({
        title: toTitleCase(entry[0]) + ":",
        items: entry[1],
      }))
      .toArray();
  };

  const parseAverage = (average: GraduateProgramAdmissionAverage) => {
    const { letterGrade, minPercentage, maxPercentage } = average;

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
  };

  return (
    <Container className={container()}>
      <div className={column()}>
        <GraduateProgramRequirementsCategory title="Program Type" items={program.type} />
        <GraduateProgramRequirementsCategory
          title="Degree"
          items={program.degree.map((degree) => (degree.acronym ? `${degree.acronym} (${degree.name})` : degree.name))}
        />
        <GraduateProgramRequirementsCategory title="Delivery" items={program.delivery} />
      </div>
      <div className={column()}>
        <GraduateProgramRequirementsCategory title="Admission Average" items={[parseAverage(program.average)]} />
        <GraduateProgramRequirementsCategory title="Duration" items={parseDuration(program.duration)} />
      </div>
      <div className={column()}>
        <GraduateProgramRequirementsCategory
          title="Deadlines & Entry Terms"
          items={parseDeadlines(program.deadlines) ?? []}
        />
      </div>
      <div className={column()}></div>
    </Container>
  );
}
