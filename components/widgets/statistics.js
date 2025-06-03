import {
  Statistics as StatisticsComponent,
  StatisticsItem,
  StatisticsItemImage,
  StatisticsItemValue,
  StatisticsItemRepresents,
} from "@uoguelph/react-components/statistics";
import { HtmlParser } from "@/components/html-parser";
import Image from "next/image";

export function Statistics({ data }) {
  const variant = data?.style?.name
    ?.toLowerCase()
    .replace(/\s/g, "-")
    .replace("colour", "color")
    .replace("gradient-of-solid-colors", "solid-colors-full")
    .replace("light-blue", "light-grey");

  return (
    <StatisticsComponent variant={variant}>
      {data?.content.map((statistic, index) => {
        return (
          <StatisticsItem key={index}>
            <StatisticsItemValue>{statistic?.value}</StatisticsItemValue>
            <StatisticsItemRepresents>
              <HtmlParser html={statistic?.represents?.processed} />
            </StatisticsItemRepresents>
            {statistic?.image && (
              <StatisticsItemImage
                src={statistic.image.image.url}
                alt={statistic.image.image.alt}
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
