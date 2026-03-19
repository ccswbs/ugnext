import { FullFeaturedNews } from "@/data/drupal/widgets";
import { FeaturedNewsFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";
import { Grid, GridProps } from "@uoguelph/react-components/grid";
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
          <NewsCard data={article} variant="vertical" />
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
          hideCategory={data.categories?.length === 1}
          className={twJoin(index === 0 && "sm:col-span-2 md:@max-[991px]:col-span-3 sm:w-full sm:[&_img]:max-h-80")}
        />
      ))}
    </div>
  );
}

function FeaturedNewsGrid({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  const gridTemplate: GridProps["template"] = {
    base: ["1fr"],
  };

  if (Array.isArray(data.articles)) {
    if (data.articles.length >= 2) {
      gridTemplate.sm = ["1fr", "1fr"];
    }
    if (data.articles.length >= 3) {
      gridTemplate.md = ["1fr", "1fr", "1fr"];
    }

    if (data.articles.length >= 4) {
      gridTemplate.lg = ["1fr", "1fr", "1fr", "1fr"];
    }
  }

  return (
    <Grid
      template={gridTemplate}
      gap={{
        x: 24,
        y: 24,
      }}
    >
      {data.articles?.map((article, index) => (
        <NewsCard variant="vertical" key={article.id} data={article} />
      ))}
    </Grid>
  );
}

function FeaturedNewsSpotlight({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  if (!Array.isArray(data.articles) || (data.articles.length !== 3 && data.articles.length < 6)) {
    throw new Error("FeaturedNewsSpotlight must have exactly 3 or more than 5 articles");
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex gap-6">
        <div className="w-2/3">
          <NewsCard variant="spotlight" data={data.articles[0]} />
        </div>
        <div className="w-1/3 flex flex-col gap-6">
          {data.articles?.slice(1, 3).map((article, index) => (
            <NewsCard variant="vertical" key={article.id} data={article} />
          ))}
        </div>
      </div>

      <FeaturedNewsGrid
        data={{
          ...data,
          articles: data.articles.slice(3),
        }}
      />
    </div>
  );
}

export function FeaturedNews({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  const context = useContext(SectionContext);

  let variant: "spotlight" | "grid" | "single-column" | "list" = "grid";

  if (!Array.isArray(data.articles)) {
    return null;
  }

  if (context?.column === "secondary" && !context?.equal) {
    variant = "list";
  } else if (
    (context?.column === "primary" && context?.equal && context?.hasSecondary) ||
    context?.column === "secondary"
  ) {
    variant = "single-column";
  } else if (!context?.hasSecondary && (data.articles.length === 3 || data.articles.length >= 6)) {
    variant = "spotlight";
  }

  return (
    <div>
      {data.title && (
        <Typography type="h3" as="h3">
          {data.title}
        </Typography>
      )}

      {variant === "spotlight" ? (
        <FeaturedNewsSpotlight data={data} />
      ) : variant === "grid" ? (
        <FeaturedNewsGrid data={data} />
      ) : variant === "single-column" ? (
        <FeaturedNewsSingleColumn data={data} />
      ) : (
        <FeaturedNewsList data={data} />
      )}
    </div>
  );
}
