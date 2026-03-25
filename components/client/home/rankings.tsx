"use client";

import {
  Statistics,
  StatisticsItem,
  StatisticsItemRepresents,
  StatisticsItemValue,
} from "@uoguelph/react-components/statistics";
import { twJoin } from "tailwind-merge";
import { Link } from "@uoguelph/react-components/link";

export function Rankings() {
  type RankingItem = {
    title: string;
    link: string;
    description: string;
  };

  const rankings: RankingItem[] = [
    {
      title: "Among World's Best in 15 Subject Areas",
      link: "https://news.uoguelph.ca/2026/03/u-of-g-veterinary-agriculture-sciences-rank-among-best-in-world-in-new-rankings/",
      description: "QS World University Rankings by Subject, 2026",
    },
    {
      title: "A Top Comprehensive University",
      link: "https://news.uoguelph.ca/2025/11/u-of-g-among-canadas-top-comprehensive-universities-macleans-rankings/",
      description: "Macleans, 2026",
    },
    {
      title: "Top 150 in the world for Life Sciences",
      link: "https://www.timeshighereducation.com/world-university-rankings/by-subject",
      description: "Times Higher Education, 2026",
    },
    {
      title: "Top 10 in Canada for Reputation",
      link: "https://news.uoguelph.ca/2025/02/u-of-g-ranked-among-top-universities-in-world-for-reputation/",
      description: "Times Higher Education, 2025",
    },
  ];

  return (
    <Statistics variant="solid-colors-no-gap">
      {rankings.map((ranking, index) => (
        <StatisticsItem>
          <StatisticsItemValue>{ranking.title}</StatisticsItemValue>
          <StatisticsItemRepresents>
            <Link className="text-inherit! outline-inherit!" href={ranking.link}>
              {ranking.description}
            </Link>
          </StatisticsItemRepresents>
        </StatisticsItem>
      ))}
    </Statistics>
  );
}
