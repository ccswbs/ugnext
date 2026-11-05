"use client";

import { EventWithoutContentFragment } from "@/lib/graphql/types";
import { FilterablePaginatedGrid } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { FilterablePaginatedGridTextBox } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-textbox";
import { EventCard } from "@/components/client/events/event-card";
import { Typography } from "@uoguelph/react-components/typography";

export function EventsSearch({ title }: { title?: string }) {
  return (
    <div>
      {title && (
        <Typography as="h2" type="h2" className="mb-4">
          {title}
        </Typography>
      )}

      <FilterablePaginatedGrid
        url="/api/events/get-events"
        render={(item: EventWithoutContentFragment) => <EventCard key={item.id} data={item} />}
        layout="grid"
      >
        <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />
      </FilterablePaginatedGrid>
    </div>
  );
}