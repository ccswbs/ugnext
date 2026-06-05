import {
  type GraduateDegree,
  type GraduateProgramVariant,
  type GraduateProgramAdmissionAverage,
  GraduateProgramApplicationDeadline,
  type GraduateProgramDelivery,
  type GraduateProgramDuration,
  type GraduateProgramType,
} from "@/lib/types/graduate-program-variant";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import { Link } from '@uoguelph/react-components/link';
import { toTitleCase } from "@/lib/string-utils";

const classes = tv({
  slots: {
    container: "p-4 w-full grid gap-4 grid-cols-1 md:grid-cols-3  bg-grey-dark-bg text-white dark",
    column: "flex flex-col gap-4",
    section: "flex flex-col gap-2",
    sectionTitle: "text-yellow-on-dark font-bold text-xl",
    sectionSubtitle: "font-bold pt-2",
    sectionList: "flex flex-col [&>li]:not-first:has-[ul]:pt-2",
  },
})();

function GraduateProgramTypes({ types }: { types: GraduateProgramType[] }) {
  return (
    <ul className={classes.sectionList()}>
      {types.map((type) => (
        <li key={type.id}>{toTitleCase(type.name)}</li>
      ))}
    </ul>
  );
}

function GraduateDegree({ degrees }: { degrees: GraduateDegree[] }) {
  return (
    <ul className={classes.sectionList()}>
      {degrees.map((degree) => (
        <li>{degree.acronym ? `${degree.acronym} (${degree.name})` : degree.name}</li>
      ))}
    </ul>
  );
}

function GraduateProgramAdmissionAverage({ average, hasFootnote = false }: { average: GraduateProgramAdmissionAverage, hasFootnote: boolean }) {
  const { letterGrade, minPercentage, maxPercentage } = average;

  const hasMin = minPercentage !== undefined;
  const hasMax = maxPercentage !== undefined;

  let percentageText = "";
  let footnote = hasFootnote ? "*" : "";

  if (hasMin && hasMax) {
    percentageText = `${minPercentage}% - ${maxPercentage}%`;
  } else if (hasMin) {
    percentageText = `${minPercentage}%`;
  } else if (hasMax) {
    percentageText = `${maxPercentage}%`;
  }

  if (letterGrade && percentageText) {
    return <span>{`${letterGrade} (${percentageText})`}</span>;
  }

  return <span>{letterGrade || percentageText || ""}{footnote}</span>;
}

function GraduateProgramDelivery({ delivery }: { delivery: GraduateProgramDelivery[] }) {
  return (
    <ul className={classes.sectionList()}>
      {delivery.map((value) => (
        <li key={value.id}>{value.name}</li>
      ))}
    </ul>
  );
}

function GraduateProgramSummarySectionMap({ map }: { map: Map<string, string[]> }) {
  const combined = map
    .entries()
    .toArray()
    .reduce((acc, [title, items]) => {
      for (const item of items) {
        const existing = acc.get(item) ?? [];

        acc.set(item, [...existing, title]);
      }

      return acc;
    }, new Map<string, string[]>())
    .entries()
    .toArray()
    .reduce((acc, [value, keys]) => {
      const combinedKey = toTitleCase(keys.join(" & "));
      const existing = acc.get(combinedKey) ?? [];

      acc.set(combinedKey, [...existing, value]);

      return acc;
    }, new Map<string, string[]>());

  const noTitleItems = combined.get("");

  return (
    <ul className={classes.sectionList()}>
      {noTitleItems && noTitleItems.map((item) => <li key={item}>{item}</li>)}

      {combined
        .entries()
        .toArray()
        .filter(([title]) => title != "")
        .sort(([a], [b]) => {
          const aHasAmpersand = a.includes("&");
          const bHasAmpersand = b.includes("&");

          if (aHasAmpersand && !bHasAmpersand) {
            return -1;
          }

          if (!aHasAmpersand && bHasAmpersand) {
            return 1;
          }

          return a.localeCompare(b);
        })
        .map(([title, items]) => (
          <li key={title}>
            <h3 className={classes.sectionSubtitle()}>{toTitleCase(title)}:</h3>

            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
    </ul>
  );
}

function GraduateProgramDuration({ duration }: { duration: GraduateProgramDuration[] }) {
  const map = duration.reduce((acc, item) => {
    const range = item.min ? `${item.min}-${item.max} months` : `${item.max} months`;
    const value = `${toTitleCase(item.type)}: ${range}`;

    const existing = acc.get(item.programType?.name ?? "") ?? [];
    acc.set(item.programType?.name ?? "", [...existing, value]);

    return acc;
  }, new Map<string, string[]>());

  return <GraduateProgramSummarySectionMap map={map} />;
}

function GraduateProgramDeadlines({ deadlines }: { deadlines: GraduateProgramApplicationDeadline[] }) {
  const firstMap = deadlines.reduce((acc, item) => {
    const date = item.ongoing
      ? "Ongoing"
      : (item.date?.timestamp === "" ? "" 
          : new Date(item.date?.timestamp ?? "").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: item.date?.showYear ? "numeric" : undefined,
          }));

    const value = `${toTitleCase(item.term)}: ${date} ${item.info ?? ""}`;

    const existing = acc.get(item.location) ?? [];
    acc.set(item.location, [...existing, value]);

    return acc;
  }, new Map<string, string[]>());

  return <GraduateProgramSummarySectionMap map={firstMap} />;
}

export function GraduateProgramSummary({ program }: { program: GraduateProgramVariant }) {
  const hasAdditionalRequirements = (program.additionalRequirements && program.additionalRequirements?.length > 0) ?? false;
  const hasProgramStructure = (program.programStructure && program.programStructure?.length > 0) ?? false;

  return (
    <Container className={classes.container()}>
      <div className={classes.column()}>
        {/* Program Type Section */}
        <div className={classes.section()}>
          <h2 className={classes.sectionTitle()}>Program Type</h2>
          <GraduateProgramTypes types={program.type} />
        </div>

        {/* Degree Section */}
        <div className={classes.section()}>
          <h2 className={classes.sectionTitle()}>Degree</h2>
          <GraduateDegree degrees={program.degrees} />
        </div>

        {/* Delivery Section*/}
        <div className={classes.section()}>
          <h2 className={classes.sectionTitle()}>Delivery</h2>
          <GraduateProgramDelivery delivery={program.delivery} />
        </div>
      </div>

    <div className={classes.column()}>
        {/* Deadlines & Entry Terms Section */}
        {/* >>>>>> TO DO - if only entry term and no content, do not render anything */}
        <div className={classes.section()}>
          <h2 className={classes.sectionTitle()}>Deadlines & Entry Terms</h2>
          <GraduateProgramDeadlines deadlines={program.deadlines} />
        </div>
      </div>

      <div className={classes.column()}>
        {/* Duration Section */}
        <div className={classes.section()}>
          <h2 className={classes.sectionTitle()}>Duration</h2>
          <GraduateProgramDuration duration={program.duration} />
        </div>

        {/* Admission Average Section */}
        <div className={classes.section()}>
          <h2 className={classes.sectionTitle()}>Admission Average</h2>
          <GraduateProgramAdmissionAverage average={program.average} hasFootnote={hasAdditionalRequirements} />
          {program.additionalRequirements && hasAdditionalRequirements && 
            <Link href={program.additionalRequirements[0]?.url}>*Additional Requirements</Link>}
        </div>

        {/* Program Structure Link */}
        <div className={classes.section()}>
          {program.programStructure && hasProgramStructure && 
            <Link href={program.programStructure[0]?.url}>Program Structure</Link>}
        </div>

      </div>
    </Container>
  );
}
