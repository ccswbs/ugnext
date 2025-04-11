import { graphql } from "@/lib/drupal";
import getPageIDQuery from "./get-page-id.graphql";
import getLegacyNewsItemQuery from "./get-legacy-news-content.graphql";
import getPageMenuQuery from "../basic-pages/get-page-menu.graphql";
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

export const getPageMenu = async (page) => {
  const parse = (node) => {
    if (Array.isArray(node?.items) && node?.items?.length > 0) {
      const items = node.items.map((item) => parse(item));

      return {
        title: node.title,
        items: node.url ? [{ title: node.title, url: node.url }, ...items] : items,
      };
    }

    return { title: node?.title, url: node?.url };
  };

  const name = "OVC_MAIN";

  const { data } = await graphql(getPageMenuQuery, {
    menu: name,
  });

  const menu = data?.menu?.items?.reduce(
    (acc, item, index) => {
      if (index === 0 && item.url) {
        acc.topic.url = item.url;
        acc.topic.title = item.title;
      } else {
        acc.navigation.push(parse(item));
      }

      return acc;
    },
    { topic: {}, navigation: [] }
  );

  return menu ?? null;
};
