import { gql } from "@/lib/graphql";
import { getClient } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { EventFragment } from "@/lib/graphql/types";
import { cache } from "react";

export const EVENT_FRAGMENT = gql(/* gql */ `
  fragment Event on NodeEvent {
    id
    title
    path
    status
    date {
      start {
        time
      }
      end {
        time
      }
    }
    heroImage {
      ... on MediaImage {
        image {
          alt
          url
          width
          height
          variations(styles: [FOCAL_POINT600X400, FOCAL_POINT900X506]) {
            url
            width
            height
          }
        }
      }
    }
  }
`);

export async function getEvent(id: string) {
  const showUnpublished = await showUnpublishedContent();
  const client = getClient();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query GetEvent($id: ID = "", $revision: ID = "current") {
        nodeEvent(id: $id, revision: $revision) {
          ...Event
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    console.error(`GraphQL Error: failed to retrieve event ${id}:\n\t${error}\n`);
    return null;
  }

  if (!data?.nodeEvent) {
    return null;
  }

  if (!data.nodeEvent.status && !showUnpublished) {
    return null;
  }

  return data.nodeEvent as EventFragment;
}

async function getAllEventsUncached() {
  const client = getClient();
  const showUnpublished = await showUnpublishedContent();

  const eventsQuery = gql(/* gql */ `
    query AllEvents($cursor: Cursor) {
      nodeEvents(after: $cursor, first: 100) {
        nodes {
          ...Event
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
  const events: EventFragment[] = [];

  while (hasNextPage) {
    const { data, error } = await client.query({
      query: eventsQuery,
      variables: { cursor },
    });

    if (error) {
      console.error(`GraphQL Error: failed to retrieve events:\n\t${error}\n`);
      break;
    }

    if (!data || !data.nodeEvents.nodes.length) {
      break;
    }

    const nodes = data.nodeEvents.nodes as EventFragment[];
    events.push(...nodes.filter((event) => showUnpublished || event.status));

    cursor = data.nodeEvents.pageInfo.endCursor;
    hasNextPage = data.nodeEvents.pageInfo.hasNextPage;
  }

  return events;
}

export const getAllEvents = cache(getAllEventsUncached);

export const VALID_PAGE_SIZES = [5, 10, 20, 25, 50];

export type EventSearchOptions = {
  page: number;
  pageSize: number;
};

function getStartTime(event: EventFragment) {
  return event.date?.start?.time ? new Date(event.date.start.time).getTime() : 0;
}

export async function getFilteredEvents(options: EventSearchOptions) {
  const { page = 0, pageSize = 20 } = options;

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    console.error(`Invalid page size: ${pageSize}. Valid page sizes are: ${VALID_PAGE_SIZES.join(", ")}`);
    return { results: [], totalPages: 0, total: 0 };
  }

  const events = [...(await getAllEvents())].sort((a, b) => getStartTime(a) - getStartTime(b));
  const total = events.length;

  return {
    results: events.slice(page * pageSize, page * pageSize + pageSize),
    totalPages: Math.ceil(total / pageSize),
    total: total,
  };
}