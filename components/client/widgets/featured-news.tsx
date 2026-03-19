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

export function FeaturedNews({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  const context = useContext(SectionContext);
  console.log(context);

  if (context?.column === "secondary" && !context?.equal) {
    return (
      <div>
        {data.title && (
          <Typography type="h3" as="h3">
            {data.title}
          </Typography>
        )}

        <List>
          {data.articles?.map((article) => {
            let url = "";

            if (article.externallyLinked && article.externalLink) {
              url = article.externalLink.url ?? article.path ?? "";
            } else {
              url = article.path ?? "";
            }

            return (
              <ListItem key={article.id}>
                <Link href={url}>{article.title}</Link>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }

  if ((context?.column === "primary" && context?.equal && context?.hasSecondary) || context?.column === "secondary") {
    return (
      <div>
        {data.title && (
          <Typography type="h3" as="h3">
            {data.title}
          </Typography>
        )}

        <div className="flex flex-col gap-4">
          {data.articles?.map((article, index) => (
            <NewsCard
              variant="horizontal"
              key={article.id}
              data={article}
              className={twJoin(
                index === 0 && "sm:col-span-2 md:@max-[991px]:col-span-3 sm:w-full sm:[&_img]:max-h-80"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 @container">
      {data.title && (
        <Typography type="h3" as="h3">
          {data.title}
        </Typography>
      )}

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
            variant="vertical"
            key={article.id}
            data={article}
            className={twJoin(index === 0 && "sm:col-span-2 md:@max-[991px]:col-span-3 sm:w-full sm:[&_img]:max-h-80")}
          />
        ))}
      </Grid>
    </div>
  );
}
