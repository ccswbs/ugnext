import { graphql } from "@/lib/drupal";
import { toTitleCase } from "@/lib/string-utils";
import getPageIDQuery from "./get-page-id.graphql";

export const getPageID = async (url) => {
  const { data } = await graphql(getPageIDQuery, {
    url: url,
  });

  return data?.route?.entity?.id;
};