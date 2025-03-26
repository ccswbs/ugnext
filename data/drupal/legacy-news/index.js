import { graphql } from "@/lib/drupal";
import getPageIDQuery from "./get-page-id.graphql";
import getLegacyNewsQuery from "./get-legacy-news-content.graphql";


export const getPageID = async (url) => {
  const { data } = await graphql(getPageIDQuery, {
    url: url,
  });

  return data?.route?.entity?.id;
};

export const getLegacyNews = async (id, status) => {
  const { data } = await graphql(getLegacyNewsQuery, {
    id: id,
    status: status,
  });
  console.log("-------------------",data)
};