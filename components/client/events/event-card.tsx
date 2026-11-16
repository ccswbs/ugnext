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

// Events can have multiple dates (recurring); only the earliest is displayed
export function getFirstEventDate(event: EventSummaryFragment) {
  return (event.date ?? []).reduce<EventSummaryFragment["date"][number] | undefined>((earliest, current) => {
    if (!current?.start?.time) return earliest;
    if (!earliest?.start?.time) return current;
    return new Date(current.start.time).getTime() < new Date(earliest.start.time).getTime() ? current : earliest;
  }, undefined);
}

export function getEventDateLabel(event: EventSummaryFragment) {
  const firstDate = getFirstEventDate(event);
  const start = firstDate?.start?.time;
  const end = firstDate?.end?.time;

  if (!start) return "";

  const startDate = formatDate(start);
  const endDate = end ? formatDate(end) : "";

  return endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate;
}

export function getEventTimeLabel(event: EventSummaryFragment) {
  const firstDate = getFirstEventDate(event);
  const start = firstDate?.start?.time;
  const end = firstDate?.end?.time;

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

// Classes that switch the date to a single large line once the "events" container (the listing grid) reaches
// the given width; written out in full for Tailwind
const STACKED_DATE_CLASSES = {
  "3xl": {
    row: "@3xl/events:flex-col @3xl/events:gap-3",
    time: "@3xl/events:w-auto @3xl/events:items-start",
    compact: "@3xl/events:hidden",
    stacked: "@3xl/events:block",
  },
  "4xl": {
    row: "@4xl/events:flex-col @4xl/events:gap-3",
    time: "@4xl/events:w-auto @4xl/events:items-start",
    compact: "@4xl/events:hidden",
    stacked: "@4xl/events:block",
  },
} as const;

export function EventCard({
  data,
  className,
  showSummary = true,
  simplifiedLayout = false,
  stackedDateFrom,
  stackMeta = false,
}: {
  data: EventSummaryFragment;
  className?: string;
  showSummary?: boolean;
  // Larger padding
  simplifiedLayout?: boolean;
  // Show the date on a single large line once the parent "events" container reaches this width
  stackedDateFrom?: keyof typeof STACKED_DATE_CLASSES;
  // Always list time and location on separate lines instead of side by side on wider screens
  stackMeta?: boolean;
}) {
  const start = getFirstEventDate(data)?.start?.time;
  const dateLabel = getEventDateLabel(data);
  const timeLabel = getEventTimeLabel(data);
  const location = data.eventLocation && "name" in data.eventLocation ? data.eventLocation.name : "";
  const summary = showSummary ? getSummaryText(data.body?.summary) : "";

  const month = start
    ? new Date(start).toLocaleDateString("en-US", { month: "short", timeZone: TIME_ZONE }).toUpperCase()
    : "";
  const day = start ? new Date(start).toLocaleDateString("en-US", { day: "numeric", timeZone: TIME_ZONE }) : "";

  const stacked = stackedDateFrom ? STACKED_DATE_CLASSES[stackedDateFrom] : null;

  return (
    <Link
      key={data.id}
      href={data.path ?? ""}
      className={twMerge(
        "w-full block hover:bg-grey-light-bg focus:bg-grey-light-bg focus:outline-none transition-colors",
        simplifiedLayout ? "p-6" : "p-4",
        className
      )}
    >
      <div className={twMerge("flex gap-6", stacked?.row)}>
        {start && (
          <time
            dateTime={start}
            aria-label={dateLabel}
            className={twMerge(
              "flex flex-col items-center shrink-0 w-12 leading-none",
              stacked?.time
            )}
          >
            <span aria-hidden="true" className={twMerge("text-md font-bold uppercase", stacked?.compact)}>
              {month}
            </span>
            <span aria-hidden="true" className={twMerge("text-4xl font-bold", stacked?.compact)}>
              {day}
            </span>
            {stacked && (
              <span aria-hidden="true" className={twMerge("hidden text-4xl font-bold", stacked.stacked)}>
                {`${month.charAt(0)}${month.slice(1).toLowerCase()} ${day}`}
              </span>
            )}
          </time>
        )}

        <div className="flex flex-col gap-1 min-w-0">
          <Typography as="h3" type="h4" className="font-bold m-0">
            {data.title}
          </Typography>

          {(timeLabel || location) && (
            <div
              className={twMerge(
                "flex flex-col gap-1 text-sm",
                !stackMeta && "sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
              )}
            >
              {timeLabel && (
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                  {timeLabel}
                </span>
              )}
              {timeLabel && location && (
                <span aria-hidden="true" className={stackMeta ? "hidden" : "hidden sm:inline"}>
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
    </Link>
  );
}
