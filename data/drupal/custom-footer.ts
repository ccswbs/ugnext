import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { handleGraphQLError, query } from "@/lib/apollo";

export const CUSTOM_FOOTER_FRAGMENT = gql(/* gql */ `
  fragment CustomFooter on NodeCustomFooter {
    __typename
    status
    title
    body {
      processed
    }
    footerLogo {
      ...Image
    }
    widgets {
      ...GeneralText
      ...Links
      ...MediaText
      ...Section
      ...Block
      ...CallToActionWidget
    }
  }
`);

async function getCustomFooterID(tags: string[], units: string[]) {
  const showUnpublished = await showUnpublishedContent();

  if (tags.length === 0 && units.length === 0) {
    return null;
  }

  const { data, error } = await query({
    query: gql(/* gql */ `
      query GetCustomFooterID($tags: [String], $units: [String], $status: Boolean) {
        customFooterByUnitOrTag(filter: { tag: $tags, unit: $units, status: $status }) {
          results {
            ... on NodeCustomFooter {
              id
            }
          }
        }
      }
    `),
    variables: {
      tags: tags ?? null,
      units: units ?? null,
      status: showUnpublished ? null : true,
    },
  });

  if (!data) {
    handleGraphQLError(error);
  }

  if (!data.customFooterByUnitOrTag?.results) {
    return null;
  }

  if (data.customFooterByUnitOrTag.results.length === 0) {
    return null;
  }

  if (data.customFooterByUnitOrTag.results[0].__typename !== "NodeCustomFooter") {
    return null;
  }

  return data.customFooterByUnitOrTag.results[0].id;
}

export async function getCustomFooterByID(id: string) {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query CustomFooterContent($id: ID!, $revision: ID = "current") {
        nodeCustomFooter(id: $id, revision: $revision) {
          ...CustomFooter
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (!data) {
    handleGraphQLError(error);
  }

  if (!data.nodeCustomFooter) {
    return null;
  }

  if (data.nodeCustomFooter.status === false && !showUnpublished) {
    return null;
  }

  return data.nodeCustomFooter;
}

export async function getCustomFooterByTagsOrUnits(tags: string[], units: string[]) {
  const showUnpublished = await showUnpublishedContent();
  const id = await getCustomFooterID(tags, units);

  if (!id) {
    return null;
  }

  return await getCustomFooterByID(id);
}
