"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { slugify } from "@/lib/string-utils";
import useSWR from "swr";
import { useContext, useMemo } from "react";
import { SectionContext } from "@/components/client/section";
import type { SectionContextType } from "@/lib/types/section-context";
import type { EventSummaryFragment, EventSearchFragment, EventCategoryFragment } from "@/lib/graphql/types";
import { FilterablePaginatedGrid } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { EventCard } from "@/components/client/events/event-card";
import { FilterablePaginatedGridTextBox } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-textbox";
import { FilterablePaginatedGridSelect } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-select";
import { EVENT_COST_OPTIONS } from "@/lib/event-cost";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

type EventsResponse = {
  results: EventSummaryFragment[];
  totalPages: number;
  total: number;
};

const MAX_SIMPLIFIED_EVENTS = 8;
// The events API only accepts certain page sizes (see VALID_PAGE_SIZES), so fetch 10 and show the first 8
const FETCH_PAGE_SIZE = 10;

// Column classes by number of columns, switching on the parent's width; written out in full for Tailwind
const GRID_COLUMN_CLASSES: Record<number, string> = {
  1: "",
  2: "@xl:grid-cols-2",
  3: "@xl:grid-cols-2 @3xl:grid-cols-3",
  4: "@xl:grid-cols-2 @4xl:grid-cols-4",
};

// Fewer than 4 events fill the row. Otherwise use whichever of 3 or 4 columns leaves the fullest last row
// (4 events -> 4, 5 or 6 -> 3, 7 or 8 -> 4), preferring 4 on a tie.
function getWideColumns(count: number, maxColumns: number) {
  if (count <= 3) return Math.max(1, Math.min(count, maxColumns));
  if (maxColumns <= 3) return 3;

  const lastRowFill = (columns: number) => (count % columns || columns) / columns;
  return lastRowFill(4) >= lastRowFill(3) ? 4 : 3;
}

export const EventListing = ({ data }: { data: EventSearchFragment }) => {
  // Check if this is a secondary column using SectionContext
  const sectionContext = useContext(SectionContext) as SectionContextType | null;
  const isSecondaryColumn = sectionContext?.column === "secondary";
  // The primary column shares its row with a secondary column, so it never gets 4 cards per row
  const maxColumns = sectionContext?.hasSecondary ? 3 : 4;
  // Check if simplified view is true
  const simplifiedView = (data.simplifiedView || isSecondaryColumn ? true : false);

  // Helper function to render the Event Listing title
  const renderTitle = () => {
    if (!data.eventSearchTitle?.trim()) return null;

    return (
      <Typography
        id={slugify(data.eventSearchTitle)}
        type={(data.headingLevel ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
        as={(data.headingLevel ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
      >
        {data.eventSearchTitle}
      </Typography>
    );
  };

  // Build API URL with units filter if provided
  const url = useMemo(() => {
    if (!data.eventSearchUnits || data.eventSearchUnits.length === 0) return `/api/events/get-events`;
    return `/api/events/get-events?units=${data.eventSearchUnits.map((units) => units.id).join(",")}`;
  }, [data.eventSearchUnits]);

  // The simple list only runs when simplifiedView is true; the grid fetches its own data
  const listUrl = useMemo(() => `${url}${url.includes("?") ? "&" : "?"}page=0&size=${FETCH_PAGE_SIZE}`, [url]);
  const { data: events, error, isLoading } = useSWR<EventsResponse>(simplifiedView ? listUrl : null, fetcher);
  // Categories are only needed for the filter in the search grid layout
  const { data: categories } = useSWR<EventCategoryFragment[]>(
    simplifiedView ? null : `/api/events/get-categories`,
    fetcher
  );

  // Render search grid layout (when simplifiedView is false)
  if (!simplifiedView) {
    return (
      <div>
        {data.eventSearchTitle && renderTitle()}

        <FilterablePaginatedGrid
          url={url}
          render={(item: EventSummaryFragment) => <EventCard key={item.id} data={item} />}
          layout="list"
        >
          <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />
          {Array.isArray(categories) && categories.length > 0 && (
            <FilterablePaginatedGridSelect
              id="categories"
              label="Filter by Type"
              multiple={true}
              options={categories.map((category) => ({ id: category.id, name: category.name }))}
            />
          )}
          <FilterablePaginatedGridSelect
            id="cost"
            label="Filter by cost"
            multiple={true}
            options={EVENT_COST_OPTIONS}
          />
        </FilterablePaginatedGrid>
      </div>
    );
  }

  // Render simple list layout
  const visibleEvents = events?.results?.slice(0, MAX_SIMPLIFIED_EVENTS) ?? [];
  const eventCount = visibleEvents.length;
  const columns = isSecondaryColumn ? 1 : getWideColumns(eventCount, maxColumns);
  // 4 across (or 3 across next to a secondary column) is too tight for the side-by-side date
  const stackedDateFrom = columns === 4 ? "4xl" : columns === 3 && sectionContext?.hasSecondary ? "3xl" : undefined;

  return (
    <>
      {isLoading && (
        <div className="flex w-full items-center justify-center flex-1 py-5">
          <LoadingIndicator />
          <span className="sr-only">Loading events...</span>
        </div>
      )}

      {error && (
        <div className="flex w-full items-center justify-center flex-1 py-5">
          <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
            An error occurred while loading events. Please try again later.
          </Typography>
        </div>
      )}

      {events && (
        <Container className="px-0">
          {data.eventSearchTitle && renderTitle()}
          {/* Columns follow the parent's width (container queries); the secondary column is always narrow */}
          <div className="@container/events">
            <div
              className={`grid grid-cols-1 gap-5 ${GRID_COLUMN_CLASSES[columns]} ${
                data.eventSearchTitle ? "pt-0 pb-8" : "py-8"
              }`}
            >
              {eventCount > 0 ? (
                visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    data={event}
                    showSummary={!isSecondaryColumn && eventCount === 1}
                    simplifiedLayout={!isSecondaryColumn}
                    stackedDateFrom={stackedDateFrom}
                    stackMeta={isSecondaryColumn || eventCount > 1}
                    className={isSecondaryColumn ? "" : "border border-grey-light hover:border-grey-light-bg"}
                  />
                ))
              ) : (
                <div className="flex w-full items-center justify-center flex-1 py-5 col-span-full">
                  <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
                    No events found.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}
    </>
  );
};
