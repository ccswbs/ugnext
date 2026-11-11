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

export type EventsProps = {
  id: string;
};

type EventImage = { alt?: string | null; url: string; width: number; height: number };

function getImage(heroImage: unknown): EventImage | null {
  return (heroImage as { image?: EventImage | null } | null)?.image ?? null;
}

const RELATED_CONTENT_TYPES = {
  NodePage: "Page",
  NodeEvent: "Event",
  NodeNews: "News",
  NodeProfile: "Profile",
} as const;

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
  const start = content.date?.start?.time;
  const end = content.date?.end?.time;
  const startDate = start ? formatDate(start) : "";
  const endDate = end ? formatDate(end) : "";
  const date = endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate;
  const time = start ? (end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start)) : "";
  const eventLocation = content.eventLocation as { id: string; name: string } | null | undefined;
  const relatedLinks = (content.relatedContent?.content ?? []).flatMap(({ __typename, title, path }) =>
    title && path ? [{ title, path, type: __typename ? RELATED_CONTENT_TYPES[__typename] : undefined }] : []
  );

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
              {/* Date */}
              {date && (
                <EventDetail label="Date">{start ? <time dateTime={start}>{date}</time> : date}</EventDetail>
              )}
              {/* Time */}
              {time && <EventDetail label="Time">{time}</EventDetail>}
              {content.customLink && content.customLink.length > 0 && (
                <EventDetail label="Register">
                  {content.customLink?.map((link, idx) =>
                    link.url ? (
                      <div key={`link-${idx}`}>
                        <Link href={link.url} className="min-w-0 wrap-break-word">
                          {link.url}
                        </Link>
                      </div>
                    ) : null
                  )}
                </EventDetail>
              )}
              {eventLocation?.name && <EventDetail label="Location">{eventLocation.name}</EventDetail>}
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
          {relatedLinks.length > 0 && (
            <>
              <Typography id="related-content" type="h2" as="h2">
                Related Content
              </Typography>
              <ul className="list-disc list-inside space-y-1 mb-4">
                {relatedLinks.map((related) => (
                  <li key={related.path}>
                    <Link href={related.path}>{related.title}</Link>
                    {related.type && ` (${related.type})`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </LayoutContent>
      <Footer></Footer>
    </Layout>
  );
}