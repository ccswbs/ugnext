import { FullFeaturedNews } from "@/data/drupal/widgets";
import { FeaturedNewsFragment } from "@/lib/graphql/types";
import { NewsCard } from "@/components/client/news/news-card";
import { Grid } from "@uoguelph/react-components/grid";

export function FeaturedNews({ data }: { data: FullFeaturedNews | FeaturedNewsFragment }) {
  return (
    <Grid
      template={{
        base: ["1fr"],
        sm: ["1fr", "1fr"],
        md: ["1fr", "1fr", "1fr"],
        lg: ["1fr", "1fr", "1fr", "1fr"],
      }}
      gap={{
        x: 16,
        y: 16,
      }}
    >
      {data.articles?.map((article) => (
        <NewsCard key={article.id} data={article} />
      ))}
    </Grid>
  );
}
