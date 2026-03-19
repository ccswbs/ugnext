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
import { Container } from "@uoguelph/react-components/container";
import { Button } from "@uoguelph/react-components/button";

function FeaturedNewsList({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  return (
    <ul className="peer flex flex-col gap-4">
      {data.articles?.map((article) => (
        <li key={article.id}>
          <NewsCard data={article} variant={data.hideImages ? "no-image" : "vertical"} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedNewsSingleColumn({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  return (
    <Container className="peer flex flex-col gap-4 px-0 [.uofg-container]:px-0">
      {data.articles?.map((article, index) => (
        <NewsCard variant="horizontal" key={article.id} data={article} hideCategory={data.categories?.length === 1} />
      ))}
    </Container>
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

    if (data.articles.length % 2 == 0) {
      gridTemplate.md = ["1fr", "1fr"];
    }
  }

  return (
    <Container className="peer">
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
    </Container>
  );
}

function FeaturedNewsSpotlight({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  if (!Array.isArray(data.articles) || (data.articles.length !== 3 && data.articles.length < 6)) {
    throw new Error("FeaturedNewsSpotlight must have exactly 3 or more than 5 articles");
  }

  return (
    <div className="flex flex-col gap-6 pb-0">
      <div className="flex flex-col lg:flex-row gap-6 lg:max-w-[137rem] lg:mx-auto lg:px-4">
        <div className="w-full lg:w-2/3">
          <NewsCard variant="spotlight" data={data.articles[0]} />
        </div>
        <Container className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col gap-6 px-4 lg:p-0">
          {data.articles?.slice(1, 3).map((article, index) => (
            <NewsCard variant="vertical" key={article.id} data={article} />
          ))}
        </Container>
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
  } else if (context?.equal && context?.hasSecondary && data.hideImages) {
    variant = "list";
  } else if (
    (context?.column === "primary" && context?.equal && context?.hasSecondary) ||
    context?.column === "secondary"
  ) {
    variant = "single-column";
  } else if (!context?.hasSecondary && (data.articles.length === 3 || data.articles.length >= 6)) {
    variant = "spotlight";
  }

  let directory = "/news/search";

  if (Array.isArray(data.categories)) {
    directory += "?categories=";
    directory += data.categories.map((category) => category.id).join(",");
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

      <Container className="peer-[ul]:px-0 peer-[.uofg-container]:px-0">
        <Button as={Link} href={directory} outlined={true} color="secondary" className="w-full md:w-fit mt-4">
          {Array.isArray(data.categories) && data.categories.length === 1
            ? `More ${data.categories[0].name}`
            : `More News`}
        </Button>
      </Container>
    </div>
  );
}
