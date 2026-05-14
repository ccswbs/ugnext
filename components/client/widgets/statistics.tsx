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
import { nanoid } from "nanoid";
import NextLink from "next/link";
import { Link } from "@uoguelph/react-components/link";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import { tv } from "tailwind-variants";

export function StatisticsWidget({ data }: { data: StatisticsFragment }) {
  const context = useContext(SectionContext);

  const variant = data?.style?.name
    ?.toLowerCase()
    .replace(/\s/g, "-")
    .replace("colour", "color")
    .replace("gradient-of-solid-colors", context === null ? "solid-colors-full" : "solid-colors-no-gap")
    .replace("light-blue", "light-grey") as StatisticsProps["variant"];

  const classes = tv({
    slots: {
      represents: "",
      link: "text-inherit! outline-inherit!",
    },
    variants: {
      variant: {
        "light-grey": {
          represents: "text-body-copy-on-light!",
        },
        "solid-colors-full": "",
        "solid-colors-no-gap": "",
        "left-border": {
          represents: "text-body-copy-on-light!",
        },
        "solid-colors": "",
      },
    },
  });

  const { represents: representsClasses, link: linkClasses } = classes({ variant: variant });

  return (
    <StatisticsComponent id={`statistics-${data.uuid}`} variant={variant}>
      {data?.content.map((statistic, index) => {
        return (
          <StatisticsItem key={index}>
            {statistic?.fontAwesomeIcon && variant === "light-grey" && (
              <i className={`${statistic.fontAwesomeIcon} fa-4x pt-6 -mb-6`}></i>
            )}
            <StatisticsItemValue>{statistic?.value}</StatisticsItemValue>
            <StatisticsItemRepresents className={representsClasses()}>
              <HtmlParser
                html={statistic?.represents?.processed}
                instructions={[
                  {
                    shouldProcessNode: (node) => node.tagName === "a",
                    processNode: (node, props, children) => {
                      return (
                        <Link
                          className={linkClasses({ variant: variant })}
                          {...props}
                          key={nanoid()}
                          href={props.href as string}
                          as={NextLink}
                        >
                          {children}
                        </Link>
                      );
                    },
                  },
                ]}
              />
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
