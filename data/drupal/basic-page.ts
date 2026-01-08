import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
import { getTestimonialByTag } from "@/data/drupal/testimonial";
import { getProfileTypes } from "@/data/drupal/profile";
import { getFullTestimonialSlider } from "@/data/drupal/widgets";

export const BASIC_PAGE_FRAGMENT = gql(/* gql */ `
  fragment BasicPage on NodePage {
    status
    id
    title
    path
    primaryNavigation {
      ...Navigation
    }
    image {
      ...Image
    }
    heroWidgets {
      ...ModalVideo
    }
    widgets {
      __typename
      ...Accordion
      ...Block
      ...GeneralText
      ...Links
      ...MediaText
      ...Tabs
      ...Statistics
      ...TestimonialSlider
      ...Story
      ...ImageOverlay
      ...Section
      ...ProfileBlock
      ...ProfileCard
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);

export async function getPageContent(id: string) {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query BasicPageContent($id: ID!, $revision: ID = "current") {
        nodePage(id: $id, revision: $revision) {
          ...BasicPage
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    try {
      handleGraphQLError(error);
    } catch (e) {
      console.error(`GraphQL Error occurred when attempting to retrieve content for basic page with id ${id}: ${e}`);
    }
    return null;
  }

  if (!data?.nodePage) {
    return null;
  }

  if (data.nodePage.status === false && !showUnpublished) {
    return null;
  }

  if (!data.nodePage.widgets) {
    return data.nodePage;
  }

  // We need to resolve testimonials by tag.
  return {
    ...data.nodePage,
    widgets: await Promise.all(
      data.nodePage.widgets.map(async (widget) => {
        switch (widget.__typename) {
          case "ParagraphTestimonialSlider":
            return await getFullTestimonialSlider(widget);
          default:
            return widget;
        }
      })
    ),
  };
}

export async function getAllBasicPagePaths() {
  const client = getClient();

  const pathQuery = gql(/* gql */ `
    query BasicPagePaths($cursor: Cursor) {
      nodePages(after: $cursor, first: 100) {
        nodes {
          __typename
          id
          status
          path
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `);

  let cursor = "";
  let hasNextPage = true;
  const paths: string[] = [];

  while (hasNextPage) {
    const { data, error } = await client.query({
      query: pathQuery,
      variables: {
        cursor,
      },
    });

    if (error) {
      handleGraphQLError(error);
    }

    if (!data) {
      return paths;
    }

    if (!data.nodePages.nodes.length) {
      return paths;
    }

    const currentPaths = data.nodePages.nodes
      .filter((page) => page.status && page.id !== "1429")
      .map((page) => page.path)
      .filter((path) => typeof path === "string");

    paths.push(...currentPaths);

    cursor = data.nodePages.pageInfo.endCursor;
    hasNextPage = data.nodePages.pageInfo.hasNextPage;
  }

  return paths;
}
