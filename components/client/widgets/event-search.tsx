import { EventSearchFragment, EventSummaryFragment } from "@/lib/graphql/types";
import { useMemo } from "react";
import { FilterablePaginatedGrid } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid";
import { EventCard } from "@/components/client/events/event-card";
import { FilterablePaginatedGridTextBox } from "@/components/client/filterable-paginated-grid/filterable-paginated-grid-textbox";
import { Typography } from "@uoguelph/react-components/typography";

export function EventSearch({ data }: { data: EventSearchFragment }) {
  const url = useMemo(() => {
    if (!data.units || data.units.length === 0) return `/api/events/get-events`;

    return `/api/events/get-events?units=${data.units.map((units) => units.id).join(",")}`;
  }, [data]);

  return (
    <div>
      {data.eventSearchTitle && (
        <Typography as="h2" type="h2" className="mb-4">
          {data.eventSearchTitle}
        </Typography>
      )}

      <FilterablePaginatedGrid
        url={url}
        render={(item: EventSummaryFragment) => <EventCard key={item.id} data={item} />}
        layout="list"
      >
        <FilterablePaginatedGridTextBox id="query" label="Search by keywords" />
      </FilterablePaginatedGrid>
    </div>
  );
}