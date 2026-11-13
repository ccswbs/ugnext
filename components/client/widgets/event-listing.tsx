"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { slugify } from "@/lib/string-utils";
import useSWR from "swr";
import { useContext, useMemo } from "react";
import { SectionContext } from "@/components/client/section";
import type { SectionContextType } from "@/lib/types/section-context";
import type { EventSummaryFragment, EventSearchFragment } from "@/lib/graphql/types";
import { FilterablePaginatedGrid } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { EventCard } from "@/components/client/events/event-card";
import { FilterablePaginatedGridTextBox } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-textbox";
import { FilterablePaginatedGridSelect } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-select";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

type EventsResponse = {
  results: EventSummaryFragment[];
  totalPages: number;
  total: number;
};

export const EventListing = ({ data }: { data: EventSearchFragment }) => {
  // Check if this is a secondary column using SectionContext
  const sectionContext = useContext(SectionContext) as SectionContextType | null;
  const isSecondaryColumn = sectionContext?.column === "secondary";

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
    if (!data.units || data.units.length === 0) return `/api/events/get-events`;
    return `/api/events/get-events?units=${data.units.map((units) => units.id).join(",")}`;
  }, [data.units]);

  // The simple list only runs in the secondary column; the grid fetches its own data
  const listUrl = useMemo(() => `${url}${url.includes("?") ? "&" : "?"}page=0&size=20`, [url]);
  const { data: events, error, isLoading } = useSWR<EventsResponse>(isSecondaryColumn ? listUrl : null, fetcher);

  // Render search grid layout (when NOT in secondary column)
  if (!isSecondaryColumn) {
    return (
      <div>
        {data.eventSearchTitle && renderTitle()}

        <FilterablePaginatedGrid
          url={url}
          render={(item: EventSummaryFragment) => <EventCard key={item.id} data={item} />}
          layout="list"
        >
          <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />
          <FilterablePaginatedGridSelect
            id="cost"
            label="Filter by cost"
            multiple={true}
            options={[
              { id: "free", name: "Free" },
              { id: "paid", name: "Paid" },
            ]}
          />
        </FilterablePaginatedGrid>
      </div>
    );
  }

  // Render simple list layout (for secondary column)
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
          <div className={`grid grid-cols-1 gap-5 ${data.eventSearchTitle ? "pt-0 pb-8" : "py-8"}`}>
            {events.results?.length > 0 ? (
              events.results.map((event) => (
                <EventCard key={event.id} data={event} showSummary={false} />
              ))
            ) : (
              <div className="flex w-full items-center justify-center flex-1 py-5">
                <Typography type="body" className="text-body-copy-bold font-bold text-center w-full">
                  No events found.
                </Typography>
              </div>
            )}
          </div>
        </Container>
      )}
    </>
  );
};
