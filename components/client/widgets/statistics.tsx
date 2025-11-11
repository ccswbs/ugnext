import {
  Statistics as StatisticsComponent,
  StatisticsItem,
  StatisticsItemImage,
  StatisticsItemValue,
  StatisticsItemRepresents,
  StatisticsProps,
} from "@uoguelph/react-components/statistics";
import { HtmlParser } from "@/components/client/html-parser";
import Image from "next/image";
import type { StatisticsFragment } from "@/lib/graphql/types";

export function StatisticsWidget({ data }: { data: StatisticsFragment }) {
  const variant = data?.style?.name
    ?.toLowerCase()
    .replace(/\s/g, "-")
    .replace("colour", "color")
    .replace("gradient-of-solid-colors", "solid-colors-full")
    .replace("light-blue", "light-grey") as StatisticsProps["variant"];

  return (
    <StatisticsComponent id={`statistics-${data.uuid}`} variant={variant}>
      {data?.content.map((statistic, index) => {
        return (
          <StatisticsItem key={index}>
            {statistic?.fontAwesomeIcon && variant === "light-grey" && (
              <i className={`${statistic.fontAwesomeIcon} fa-4x pt-6 -mb-6`}></i>
            )}
            <StatisticsItemValue>{statistic?.value}</StatisticsItemValue>
            <StatisticsItemRepresents>
              <HtmlParser html={statistic?.represents?.processed} />
            </StatisticsItemRepresents>
            {statistic?.image && (
              <StatisticsItemImage
                src={statistic.image.image.url}
                alt={statistic.image.image.alt ?? ""}
                width={statistic.image.image.width}
                height={statistic.image.image.height}
                as={Image}
              />
            )}
          </StatisticsItem>
        );
      })}
    </StatisticsComponent>
  );
}
