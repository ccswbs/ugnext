import { Statistics } from "@/components/statistics";
import { UnstyledLink } from "@/components/link";
import { twJoin } from "tailwind-merge";

export const Rankings = () => {
  const linkClasses = twJoin(
    "underline underline-offset-2 decoration-transparent hover:decoration-current focus:decoration-current transition-colors"
  );

  return (
    <Statistics
      variant="solid-colors-no-gap"
      data={[
        {
          represents: (
            <UnstyledLink
              className={linkClasses}
              color="none"
              href="https://sustainabilitymag.com/sustainability/inside-the-worlds-most-sustainable-university"
            >
              QS Sustainability Rankings, 2023
            </UnstyledLink>
          ),
          value: (
            <>
              Top 10% for <strong>Sustainability</strong>
            </>
          ),
        },
        {
          represents: (
            <UnstyledLink
              className={linkClasses}
              color="none"
              href="https://education.macleans.ca/feature/canadas-best-comprehensive-universities-rankings-2024/"
            >
              Macleans, 2024
            </UnstyledLink>
          ),
          value: (
            <>
              A <strong>Top Comprehensive University</strong> in Canada
            </>
          ),
        },
        {
          represents: (
            <UnstyledLink
              className={linkClasses}
              color="none"
              href="https://www.timeshighereducation.com/world-university-rankings/by-subject"
            >
              Times Higher Education, 2023
            </UnstyledLink>
          ),
          value: (
            <>
              <strong>Top 150</strong> in the world for <strong>Life Sciences</strong>
            </>
          ),
        },
        {
          represents: (
            <UnstyledLink
              className={linkClasses}
              color="none"
              href="https://news.uoguelph.ca/2025/02/u-of-g-ranked-among-top-universities-in-world-for-reputation/"
            >
              Times Higher Education, 2025
            </UnstyledLink>
          ),
          value: (
            <>
              <strong>Top 10</strong> in Canada for Reputation
            </>
          ),
        },
      ]}
    />
  );
};
