import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { getClient, handleGraphQLError, query } from "@/lib/apollo";
import { ProcessedWidget, WidgetProcessor } from "@/data/drupal/widgets";
import { BasicPageFragment } from "@/lib/graphql/types";

export const BASIC_PAGE_MINIMAL_FRAGMENT = gql(/* gql */ `
  fragment BasicPageMinimal on NodePage {
    status
    id
    title
    path
  }
`);

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
      ...NewsSearch
      ...FeaturedNews
      ...Tabs
      ...Statistics
      ...TestimonialSlider
      ...Story
      ...ImageOverlay
      ...Section
      ...ProfileBlock
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);

export type ProcessedBasicPage = Omit<BasicPageFragment, "widgets"> & {
  widgets: ProcessedWidget[];
};

export async function getPageContent(id: string): Promise<ProcessedBasicPage | null> {
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
    console.error(`GraphQL Error: failed to retrieve content for basic page ${id}:\n\t${error}\n`);
    return null;
  }

  if (!data?.nodePage) {
    return null;
  }

  if (data.nodePage.status === false && !showUnpublished) {
    return null;
  }

  if (!data.nodePage.widgets) {
    return {
      ...data.nodePage,
      widgets: [] as ProcessedWidget[],
    };
  }

  const processor = new WidgetProcessor();
  return {
    ...data.nodePage,
    widgets: await processor.processWidgets(data.nodePage.widgets),
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
      .filter((page) => page.status)
      .map((page) => page.path)
      .filter((path) => typeof path === "string");

    paths.push(...currentPaths);

    cursor = data.nodePages.pageInfo.endCursor;
    hasNextPage = data.nodePages.pageInfo.hasNextPage;
  }

  return paths;
}
