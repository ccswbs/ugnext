import { graphql } from "@/lib/drupal";
import { toTitleCase } from "@/lib/string-utils";

import getFeaturedLegacyNewsQuery from "./get-featured-legacy-news.graphql";
import getPageIDQuery from "./get-page-id.graphql";
import getLegacyNewsItemQuery from "./get-legacy-news-content.graphql";
import getLegacyNewsListQuery from "./get-legacy-news-list.graphql";

export const getPageID = async (url) => {
  const { data } = await graphql(getPageIDQuery, {
    url: url,
  });

  return data?.route?.entity?.id;
};

export const getLegacyNews = async (id, status) => {
  const { data } = await graphql(getLegacyNewsItemQuery, {
    id: id,
    status: status,
  });

  return data;
};

export const getLegacyNewsList = async () => {
  const { data } = await graphql(getLegacyNewsListQuery, {});

  return data.legacyNews.results;
};

export const getFeaturedLegacyNews = async () => {
  const { data } = await graphql(getFeaturedLegacyNewsQuery, {});

  return data?.featuredLegacyNews?.results;
};

