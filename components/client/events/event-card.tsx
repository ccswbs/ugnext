"use client";

import { EventSummaryFragment } from "@/lib/graphql/types";
import { LazyLink as Link } from "@/components/client/widgets/lazy-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLocationDot } from "@awesome.me/kit-7993323d0c/icons/classic/regular";
import { twMerge } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";

const TIME_ZONE = "America/Toronto";
const SUMMARY_MAX_LENGTH = 160;

function formatDate(time: string) {
  return new Date(time).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

function formatShortDate(time: string) {
  return new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TIME_ZONE });
}

export function getEventDateLabel(event: EventSummaryFragment) {
  const start = event.date?.start?.time;
  const end = event.date?.end?.time;

  if (!start) return "";

  const startDate = formatDate(start);
  const endDate = end ? formatDate(end) : "";

  return endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate;
}

export function getEventTimeLabel(event: EventSummaryFragment) {
  const start = event.date?.start?.time;
  const end = event.date?.end?.time;

  if (!start) return "";

  const startTime = formatTime(start);

  if (!end) return startTime;

  const endTime = formatTime(end);

  // Multi-day events need the end date to be unambiguous
  if (formatDate(start) !== formatDate(end)) {
    return `${startTime} - ${formatShortDate(end)}, ${endTime}`;
  }

  return endTime !== startTime ? `${startTime} - ${endTime}` : startTime;
}

function getSummaryText(summary?: string | null) {
  if (!summary) return "";

  const text = summary
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > SUMMARY_MAX_LENGTH ? `${text.slice(0, SUMMARY_MAX_LENGTH).trimEnd()}…` : text;
}

export function EventCard({
  data,
  className,
  showSummary = true,
}: {
  data: EventSummaryFragment;
  className?: string;
  showSummary?: boolean;
}) {
  const start = data.date?.start?.time;
  const dateLabel = getEventDateLabel(data);
  const timeLabel = getEventTimeLabel(data);
  const location = data.eventLocation && "name" in data.eventLocation ? data.eventLocation.name : "";
  const summary = showSummary ? getSummaryText(data.body?.summary) : "";

  const month = start
    ? new Date(start).toLocaleDateString("en-US", { month: "short", timeZone: TIME_ZONE }).toUpperCase()
    : "";
  const day = start ? new Date(start).toLocaleDateString("en-US", { day: "numeric", timeZone: TIME_ZONE }) : "";

  return (
    <div key={data.id} className={twMerge("w-full flex gap-4 px-4 py-4 sm:gap-6 sm:px-6", className)}>
      {start && (
        <time dateTime={start} aria-label={dateLabel} className="flex flex-col items-center shrink-0 w-12 leading-none">
          <span aria-hidden="true" className="text-sm font-bold uppercase">
            {month}
          </span>
          <span aria-hidden="true" className="text-4xl font-bold">
            {day}
          </span>
        </time>
      )}

      <div className="flex flex-col gap-1 min-w-0">
        <Typography as="h3" type="h4" className="font-bold m-0">
          <Link
            href={data.path ?? ""}
            className="underline decoration-transparent hover:decoration-black focus-visible:decoration-black transition-colors"
          >
            {data.title}
          </Link>
        </Typography>

        {(timeLabel || location) && (
          <div className="flex flex-col gap-1 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
            {timeLabel && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                {timeLabel}
              </span>
            )}
            {timeLabel && location && (
              <span aria-hidden="true" className="hidden sm:inline">
                |
              </span>
            )}
            {location && (
              <span className="flex items-baseline gap-1.5">
                <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
                {location}
              </span>
            )}
          </div>
        )}

        {summary && (
          <Typography as="p" type="body">
            {summary}
          </Typography>
        )}
      </div>
    </div>
  );
}
