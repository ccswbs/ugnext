import { graphql } from "@/lib/drupal";
import getFeaturedLegacyNewsQuery from "./get-featured-legacy-news.graphql";
import getFeaturedLegacyEventsQuery from "./get-featured-legacy-events.graphql";

export const getFeaturedLegacyNews = async () => {
    const { data } = await graphql(getFeaturedLegacyNewsQuery, {

    })

    return data?.featuredLegacyNews?.results;
};
export const getFeaturedLegacyEvents = async () => {
    const { data } = await graphql(getFeaturedLegacyEventsQuery, {

    })
    return data?.featuredEvents?.results;
};