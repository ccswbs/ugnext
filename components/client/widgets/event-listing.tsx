"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";
import { slugify } from "@/lib/string-utils";
import useSWR from "swr";
import { useContext, useMemo } from "react";
import { SectionContext } from "@/components/client/section";
import type { SectionContextType } from "@/lib/types/section-context";
import type { EventWithoutContentFragment, EventSearchFragment } from "@/lib/graphql/types";
import { getEventDateLabel } from "@/components/client/events/event-card";
import { FilterablePaginatedGrid } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { EventCard } from "@/components/client/events/event-card";
import { FilterablePaginatedGridTextBox } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-textbox";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TIME_ZONE = "America/Toronto";

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

function getEventTimeLabel(event: EventWithoutContentFragment) {
  const start = event.date?.start?.time;
  const end = event.date?.end?.time;

  if (!start) return "";

  const startTime = formatTime(start);
  const endTime = end ? formatTime(end) : "";

  return endTime && endTime !== startTime ? `${startTime} - ${endTime}` : startTime;
}

type EventsResponse = {
  results: EventWithoutContentFragment[];
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
        {data.eventSearchTitle && (
          <Typography as="h2" type="h2" className="mb-4">
            {data.eventSearchTitle}
          </Typography>
        )}

        <FilterablePaginatedGrid
          url={url}
          render={(item: EventWithoutContentFragment) => <EventCard key={item.id} data={item} />}
          layout="grid"
        >
          <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />
        </FilterablePaginatedGrid>
      </div>
    );
  }

  // Render simple list layout (for secondary column)
  return (
    <>
      {sectionContext ? renderTitle() : (
        data.eventSearchTitle?.trim() && (
          <Container>
            {renderTitle()}
          </Container>
        )
      )}
      
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
        <Container>
          <div className="grid grid-cols-1 gap-5 py-8">
            {events.results?.length > 0 ? (
              events.results.map((event) => {
                const start = event.date?.start?.time;
                const dateLabel = getEventDateLabel(event);
                const timeLabel = getEventTimeLabel(event);

                return (
                  <div key={event.id} className="flex flex-col gap-1">
                    {dateLabel && (
                      <Typography as="span" type="body" className="m-0 uppercase">
                        {start ? <time dateTime={start}>{dateLabel}</time> : dateLabel}
                      </Typography>
                    )}
                    {timeLabel && (
                      <Typography as="span" type="body" className="m-0">
                        {timeLabel}
                      </Typography>
                    )}
                    <Typography as="span" type="h4" className="font-bold m-0">
                      {event.title}
                    </Typography>
                  </div>
                );
              })
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
