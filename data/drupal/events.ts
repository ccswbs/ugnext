import { gql } from "@/lib/graphql";
import { getClient } from "@/lib/apollo";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { EventFragment, EventSummaryFragment } from "@/lib/graphql/types";

export const EVENT_SUMMARY = gql(/* gql */ `
  fragment EventSummary on NodeEvent {
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
    eventLocation {
      ... on TermLocation {
        id
        name
      }
    }
    cost
    costDetails {
      processed
    }
    body {
      summary
    }
  }
`);

export const EVENT_FRAGMENT = gql(/* gql */ `
  fragment Event on NodeEvent {
    ...EventSummary
    body {
      processed
    }
    customLink {
      title
      url
    }
    heroImage {
      attribution {
        url
        title
      }
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
    eventSections {
      ... on ParagraphEventPart {
        id
        eventPartLabel
        eventPartText {
          processed
        }
      }
    }
    relatedContent {
      ...RelatedContentGroup
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

export const VALID_PAGE_SIZES = [5, 10, 20, 25, 50];

export type EventSearchOptions = {
  query?: string;
  units?: string[];
  cost?: string;
  page: number;
  pageSize: number;
};

export async function getFilteredEvents(options: EventSearchOptions) {
  const { query, page = 0, pageSize = 20, units, cost } = options;

  if (!VALID_PAGE_SIZES.includes(pageSize)) {
    console.error(`Invalid page size: ${pageSize}. Valid page sizes are: ${VALID_PAGE_SIZES.join(", ")}`);

    return {
      results: [],
      totalPages: 0,
      total: 0,
    };
  }

  const client = getClient();
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await client.query({
    query: gql(/* gql */ `
      query EventsSearch(
        $page: Int
        $pageSize: Int
        $units: [String]
        $query: String
        $status: Boolean
      ) {
        eventsSearch(
          page: $page
          pageSize: $pageSize
          filter: { units: $units, query: $query, status: $status }
        ) {
          results {
            ...EventSummary
          }
          pageInfo {
            pageSize
            total
          }
        }
      }
    `),
    variables: {
      page: page,
      pageSize: pageSize,
      units: units ?? [],
      query: query ?? "",
      status: showUnpublished ? null : true,
    },
  });

  if (error || !data || !data.eventsSearch) {
    console.error(`GraphQL Error: failed to retrieve events:\n\t${error}\n`);
    return {
      results: [],
      totalPages: 0,
      total: 0,
    };
  }

  let results = data.eventsSearch.results as EventSummaryFragment[];

  // Filter by cost if provided
  if (cost) {
    const costOptions = cost.split(",").map(c => c.trim()).filter(Boolean);
    if (costOptions.length > 0) {
      results = results.filter(event => {
        return costOptions.some(costOption => {
          if (costOption === "free") {
            return event.cost.length === 0 || event.cost.every(c => c === 0);
          } else if (costOption === "paid") {
            return event.cost.length > 0 && event.cost.some(c => c > 0);
          }
          return false;
        });
      });
    }
  }

  if (showUnpublished) {
    const latestRevisionQuery = gql(/* gql */ `
      query LatestRevisionEvent($id: ID!) {
        nodeEvent(id: $id, revision: "latest") {
          ...EventSummary
        }
      }
    `);

    results = await Promise.all(
      results.map(async (result) => {
        const { data } = await client.query({
          query: latestRevisionQuery,
          variables: { id: result.id },
        });

        if (!data || !data.nodeEvent) {
          console.warn(`Failed to fetch latest revision for event ${result.id}, falling back to original result`);
          return result;
        }

        return data.nodeEvent as EventSummaryFragment;
      })
    );
  }

  return {
    results: results,
    totalPages: Math.ceil(data.eventsSearch.pageInfo.total / pageSize),
    total: data.eventsSearch.pageInfo.total,
  };
}