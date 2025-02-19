import { Statistics } from "@/components/statistics";
import { UnstyledLink } from "@/components/link";
import { twJoin } from "tailwind-merge";

export const OVCRankings = () => {
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
              href="https://www.studyin-canada.com/study-guide/best-veterinary-medicine-universities-in-canada/"
            >
            SI-Canada, 2023
            </UnstyledLink>
          ),
          value: (
            <>
                #1 in Canada
            </>
          ),
        },
        {
          represents: (
            <UnstyledLink
              className={linkClasses}
              color="none"
              href="https://ovc.uoguelph.ca/news/node/1498"
            >
              Source Needed!
            </UnstyledLink>
          ),
          value: (
            <>
              #3 North America
            </>
          ),
        },
        {
          represents: (
            <UnstyledLink
              className={linkClasses}
              color="none"
              href="https://www.topuniversities.com/university-subject-rankings/veterinary-science/2023"
            >
              QS Sustainability Rankings, 2023
            </UnstyledLink>
          ),
          value: (
            <>
              Top Ten Worldwide
            </>
          ),
        },
      ]}
    />
  );
};
