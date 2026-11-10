"use client";

import { EventWithoutContentFragment } from "@/lib/graphql/types";
import { LazyLink as Link } from "@/components/client/widgets/lazy-link";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo-16x9.jpeg";
import { twMerge } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";

const TIME_ZONE = "America/Toronto";

function formatDate(time: string) {
  return new Date(time).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}
export function getEventDateLabel(event: EventWithoutContentFragment) {
  const start = event.date?.start?.time;
  const end = event.date?.end?.time;

  if (!start) return "";

  const startDate = formatDate(start);
  const endDate = end ? formatDate(end) : "";

  return endDate && endDate !== startDate ? `${startDate} - ${endDate}` : startDate;
}

export function EventCard({ data, className }: { data: EventWithoutContentFragment; className?: string }) {
  const img = data.heroImage?.image.variations?.[0];
  const dateLabel = getEventDateLabel(data);
  const start = data.date?.start?.time;

  return (
    <Link
      key={data.id}
      href={data.path ?? ""}
      className={twMerge("w-full flex flex-col gap-3 transition-colors group", className)}
    >
      <div className="overflow-hidden w-full">
        <Image
          src={img?.url ?? defaultImage.src}
          alt=""
          width={img?.width ?? 800}
          height={img?.height ?? 450}
          className="aspect-video w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-110"
        />
      </div>

      <div className="w-full flex-col flex gap-3">
        {dateLabel && (
          <Typography as="span" type="body" className="text-lg m-0 uppercase">
            {start ? <time dateTime={start}>{dateLabel}</time> : dateLabel}
          </Typography>
        )}

        <Typography
          as="span"
          type="h4"
          className="font-bold m-0 underline decoration-transparent group-hover:decoration-black transition-colors group-focus:underline"
        >
          {data.title}
        </Typography>
      </div>
    </Link>
  );
}