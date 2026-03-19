import { FullFeaturedNews } from "@/data/drupal/widgets";
import { FeaturedNewsFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";
import { Grid } from "@uoguelph/react-components/grid";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Link } from "@uoguelph/react-components/link";
import { twJoin } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";

function FeaturedNewsList({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  return (
    <ul className="flex flex-col gap-4">
      {data.articles?.map((article) => (
        <li key={article.id}>
          <NewsCard data={article} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedNewsSingleColumn({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  return (
    <div className="flex flex-col gap-4">
      {data.articles?.map((article, index) => (
        <NewsCard
          variant="horizontal"
          key={article.id}
          data={article}
          className={twJoin(index === 0 && "sm:col-span-2 md:@max-[991px]:col-span-3 sm:w-full sm:[&_img]:max-h-80")}
        />
      ))}
    </div>
  );
}

function FeaturedNewsGrid({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  return (
    <Grid
      template={{
        base: ["1fr"],
        sm: ["1fr", "1fr"],
        md: ["1fr", "1fr", "1fr"],
      }}
      gap={{
        x: 16,
        y: 16,
      }}
    >
      {data.articles?.map((article, index) => (
        <NewsCard
          variant={index === 0 ? "spotlight" : "vertical"}
          key={article.id}
          data={article}
          className={twJoin(index === 0 && "sm:col-span-2 md:@max-[991px]:col-span-3 sm:w-full sm:[&_img]:max-h-80")}
        />
      ))}
    </Grid>
  );
}

export function FeaturedNews({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  const context = useContext(SectionContext);

  let variant: "grid" | "single-column" | "list" = "grid";

  if (context?.column === "secondary" && !context?.equal) {
    variant = "list";
  } else if (
    (context?.column === "primary" && context?.equal && context?.hasSecondary) ||
    context?.column === "secondary"
  ) {
    variant = "single-column";
  }

  return (
    <div>
      {data.title && (
        <Typography type="h3" as="h3">
          {data.title}
        </Typography>
      )}
      {variant === "grid" ? (
        <FeaturedNewsGrid data={data} />
      ) : variant === "single-column" ? (
        <FeaturedNewsSingleColumn data={data} />
      ) : (
        <FeaturedNewsList data={data} />
      )}
    </div>
  );
}
