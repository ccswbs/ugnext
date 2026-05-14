import { GraduateProgram } from "@/lib/types/graduate-program";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";

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
      categorySubtitle: "",
      categoryList: "",
      categoryListItem: "",
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

export function GraduateProgramRequirements({ program }: { program: GraduateProgram }) {
  const classes = tv({
    slots: {
      container: "p-4 w-full grid md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-grey-dark-bg text-white",
      column: "",
    },
  });

  const { container, column } = classes();

  const parseDuration = (duration: GraduateProgram["duration"]) => {
    return [];
  };

  const parseDeadlines = (deadlines: GraduateProgram["deadlines"]) => {
    const locationMap = new Map<string, string[]>();

    for (const deadline of deadlines) {
      const existing = locationMap.get(deadline.location);

      if (existing) {
        locationMap.set(deadline.location, [...existing, `${deadline.term}: ${deadline.date}`]);
      } else {
        locationMap.set(deadline.location, [`${deadline.term}: ${deadline.date}`]);
      }
    }

    return locationMap
      .entries()
      .map((entry) => ({
        title: entry[0],
        items: entry[1],
      }))
      .toArray();
  };

  return (
    <Container className={container()}>
      <div className={column()}>
        <GraduateProgramRequirementsCategory title="Program Type" items={program.type} />
        <GraduateProgramRequirementsCategory title="Degree" items={program.degree.map((degree) => degree.name)} />
        <GraduateProgramRequirementsCategory title="Delivery" items={program.delivery} />
      </div>
      <div className={column()}>
        <GraduateProgramRequirementsCategory title="Admission Average" items={[program.average.details]} />
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
