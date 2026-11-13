import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Link } from "@uoguelph/react-components/link";
import { Header } from "@/components/server/header";
import { HtmlParser } from "@/components/client/html-parser";
import { getEvent } from "@/data/drupal/events";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { slugify } from "@/lib/string-utils";
import { EventDates, EventOccurrence } from "@/components/client/events/event-dates";
import { RelatedContent } from "@/components/client/related-content";
import { getIconForUrl } from "@/lib/ug-utils";

export type EventsProps = {
  id: string;
};

type EventImage = { alt?: string | null; url: string; width: number; height: number };

function getImage(heroImage: unknown): EventImage | null {
  return (heroImage as { image?: EventImage | null } | null)?.image ?? null;
}

const TIME_ZONE = "America/Toronto";

function formatDate(time: string) {
  return new Date(time).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

function formatTime(time: string) {
  return new Date(time)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE })
    .toLowerCase();
}

function getOccurrences(dates: { start?: { time: any } | null; end?: { time: any } | null }[]) {
  return dates
    .flatMap((range) => {
      const start = range.start?.time as string | undefined;
      const end = range.end?.time as string | undefined;

      if (!start) return [];

      const startDate = formatDate(start);
      const endDate = end ? formatDate(end) : "";

      return {
        start,
        date: endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate,
        time: end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start),
      } satisfies EventOccurrence;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

function formatCost(costArray: number[] | null | undefined): string | null {
  if (!costArray || costArray.length === 0) return null;

  const sorted = [...costArray].sort((a, b) => a - b);
  const unique = Array.from(new Set(sorted));

  if (unique.length === 1) {
    switch (unique[0]) {
      case 0:
        return null;
      case 10:
        return "Under $10";
      case 101:
        return "Over $100";
    }
  }

  const lowest = unique[0];
  const highest = unique[unique.length - 1];

  if (highest === 101) {
    return `$${lowest} and above`;
  }

  return `$${lowest} - $${highest}`;
}

function EventDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 wrap-break-word">
      <span className="font-bold">{label}:</span> {children}
    </div>
  );
}

export async function Events({ id }: EventsProps) {
  const content = await getEvent(id);

  if (!content) {
    if (process.env.NODE_ENV === "development" && process.env.APP_ENV !== "live") {
      console.warn(`Couldn't find content for event with id ${id}`);
    }

    notFound();
  }

  const image = getImage(content.heroImage);
  const occurrences = getOccurrences(content.date ?? []);
  const eventLocation = content.eventLocation as { id: string; name: string } | null | undefined;

  return (
    <Layout>
      <Header />

      <LayoutContent container={false}>
        <Breadcrumbs url={content.path ?? undefined} />
        <Container>
          <Typography type="h1" as="h1" className="mb-4">
            {content.title}
          </Typography>

          <div className="md:flex md:gap-6 md:items-start">
            {image && (
              <Image
                alt={image.alt ?? ""}
                height={image.height}
                width={image.width}
                src={image.url}
                className="w-full max-w-full md:w-1/3 md:max-w-1/3 object-contain mb-4"
              />
            )}
            <div className="md:flex-1">
              {occurrences.length === 1 && (
                <>
                  <EventDetail label="Date">
                    <time dateTime={occurrences[0].start}>{occurrences[0].date}</time>
                  </EventDetail>
                  <EventDetail label="Time">{occurrences[0].time}</EventDetail>
                </>
              )}
              {eventLocation?.name && <EventDetail label="Location">{eventLocation.name}</EventDetail>}
              {occurrences.length > 1 && <EventDates occurrences={occurrences} />}
              {content.costDetails?.processed ? (
                <HtmlParser key="event-cost-details" html={content.costDetails.processed} instructions={undefined} />
              ) : formatCost(content.cost) ? (
                <EventDetail label="Cost">{formatCost(content.cost)}</EventDetail>
              ) : null}
              {content.customLink && content.customLink.length > 0 && (
                <div className="mt-4">
                  {content.customLink?.map((link, idx) =>
                    link.url ? (
                      <div key={`link-${idx}`}>
                        <div className="flex items-center gap-2">
                          <i className={`${getIconForUrl(link.url)} fa-fw shrink-0`} aria-hidden="true"></i>
                          <Link href={link.url} className="min-w-0 break-words">
                            {link.title}
                          </Link>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
              
            </div>
          </div>
          <HtmlParser key="event-body" html={content.body?.processed ?? ""} instructions={undefined} />
          {/* Render all Event Sections in order */}
          {content.eventSections?.map((section, index) => {
            // Event part with custom content
            if (section.eventPartLabel) {
              return (
                <div key={section.id || index}>
                  <Typography id={slugify(section.eventPartLabel)} type="h2" as="h2">
                    {section.eventPartLabel}
                  </Typography>
                  <HtmlParser
                    key={section.id}
                    html={section.eventPartText?.processed ?? ""}
                    instructions={undefined}
                  />
                </div>
              );
            }
            return null;
          })}
          <RelatedContent relatedContent={content.relatedContent} />
        </Container>
      </LayoutContent>
      <Footer></Footer>
    </Layout>
  );
}