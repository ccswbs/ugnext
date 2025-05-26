import {
  Statistics,
  StatisticsItem,
  StatisticsItemRepresents,
  StatisticsItemValue,
} from "@uoguelph/react-components/statistics";
import { twJoin } from "tailwind-merge";

export const Rankings = () => {
  const linkClasses = twJoin(
    "underline underline-offset-2 decoration-transparent hover:decoration-current focus:decoration-current transition-colors"
  );

  return (
    <Statistics variant="solid-colors-no-gap">
      <StatisticsItem>
        <StatisticsItemValue>
          Among <strong>World's Best</strong> in 12 Subject Areas
        </StatisticsItemValue>
        <StatisticsItemRepresents>
          <a
            className={linkClasses}
            href="https://news.uoguelph.ca/2025/03/u-of-gs-ovc-ranks-6th-in-world-oac-in-top-tier-in-new-global-ranking/"
          >
            QS World University Rankings by Subject, 2025
          </a>
        </StatisticsItemRepresents>
      </StatisticsItem>

      <StatisticsItem>
        <StatisticsItemValue>
          A <strong>Top Comprehensive University</strong> in Canada
        </StatisticsItemValue>
        <StatisticsItemRepresents>
          <a
            className={linkClasses}
            href="https://education.macleans.ca/feature/canadas-best-comprehensive-universities-rankings-2024/"
          >
            Macleans, 2024
          </a>
        </StatisticsItemRepresents>
      </StatisticsItem>

      <StatisticsItem>
        <StatisticsItemValue>
          <strong>Top 150</strong> in the world for <strong>Life Sciences</strong>
        </StatisticsItemValue>
        <StatisticsItemRepresents>
          <a className={linkClasses} href="https://www.timeshighereducation.com/world-university-rankings/by-subject">
            Times Higher Education, 2025
          </a>
        </StatisticsItemRepresents>
      </StatisticsItem>

      <StatisticsItem>
        <StatisticsItemValue>
          <strong>Top 10</strong> in Canada for Reputation
        </StatisticsItemValue>
        <StatisticsItemRepresents>
          <a
            className={linkClasses}
            href="https://news.uoguelph.ca/2025/02/u-of-g-ranked-among-top-universities-in-world-for-reputation/"
          >
            Times Higher Education, 2025
          </a>
        </StatisticsItemRepresents>
      </StatisticsItem>
    </Statistics>
  );
};
