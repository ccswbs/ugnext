"use client";

import { useId, useState } from "react";
import { Button } from "@uoguelph/react-components/button";

const INITIAL_VISIBLE_COUNT = 5;

export type EventOccurrence = { start: string; date: string; time: string };

export function EventDates({ occurrences }: { occurrences: EventOccurrence[] }) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const hasMore = occurrences.length > INITIAL_VISIBLE_COUNT;
  const visible = expanded ? occurrences : occurrences.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <div className="mb-2">
      <span className="font-bold">Dates:</span>
      <ul id={listId} className="list-none m-0 p-0">
        {visible.map((occurrence) => (
          <li key={occurrence.start} className="wrap-break-word">
            <time dateTime={occurrence.start}>{occurrence.date}</time>, {occurrence.time}
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button
          color="primary"
          outlined
          className="mt-2"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer dates" : `Show all ${occurrences.length} dates`}
        </Button>
      )}
    </div>
  );
}
