import { FullFeaturedNews } from "@/data/drupal/widgets";
import { FeaturedNewsFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";
import { Grid } from "@uoguelph/react-components/grid";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Link } from "@uoguelph/react-components/link";

export function FeaturedNews({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  const context = useContext(SectionContext);

  console.log(context);

  if (context?.column === "secondary") {
    return (
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
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-[calc(137rem*2/3)]">
      {data.articles?.[0] && <NewsCard key={data.articles[0].id} data={data.articles[0]} large={true} />}

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
        {data.articles?.slice(1)?.map((article) => (
          <NewsCard key={article.id} data={article} />
        ))}
      </Grid>
    </div>
  );
}
