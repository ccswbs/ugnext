import { graphql } from "@/lib/drupal";
import getFeaturedLegacyNewsQuery from "./get-featured-legacy-news.graphql";

export const getFeaturedLegacyNews = async () => {
  const { data } = await graphql(getFeaturedLegacyNewsQuery, {});

  return data?.featuredLegacyNews?.results;
};
