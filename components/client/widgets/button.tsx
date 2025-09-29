"use client";

import type { ButtonsFragment } from "@/lib/graphql/types";
import { tv } from "tailwind-variants";
import { MouseEventHandler } from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { HtmlParser } from "@/components/client/html-parser";
import { Button } from "@uoguelph/react-components/button";
import Link from "next/link";

export type ButtonColumn = "primary" | "secondary" | "call-to-action";

export const ButtonWidget = ({ data, column }: { data: ButtonsFragment; column: ButtonColumn }) => {
  const url = data.link?.url;

  if (!url) {
    console.error(`Widget Error ${data.__typename}: A URL must be defined for the button`, data);
    return <></>;
  }

  const title = data.formattedTitle ? (data.formattedTitle.processed as string) : data.link?.title;

  if (!title) {
    console.error(
      `Widget Error ${data.__typename}: A title must be defined for the button either in its formatted title field or link title field`,
      data
    );
    return <></>;
  }

  const heading = data.ctaHeading?.processed as string | undefined | null;

  let color: "red" | "black" | "blue" = "red";
  switch (data.style?.name?.toLowerCase()?.replace("(outline)", "").trim()) {
    case "primary":
      color = "red";
      break;
    case "secondary":
      color = "black";
      break;
    case "info":
      color = "blue";
      break;
  }

  const icon = {
    data: data.fontAwesomeIcon,
    color: data.fontAwesomeIconColour?.name?.toLowerCase()?.replace("darker", "")?.trim() as
      | "red"
      | "yellow"
      | undefined,
  };
  const outlined = Boolean(data.style?.name?.includes("Outline"));
  const analytics = data.ctaAnalyticsGoal
    ? {
        goal: data.ctaAnalyticsGoal.name,
        action: data.ctaAnalyticsGoal.action,
      }
    : null;

  const classes = tv({
    slots: {
      heading: "block text-black",
      button: "w-fit font-medium flex items-center justify-start! gap-x-1 leading-6 mx-0",
      icon: ["pe-3 text-4xl inline-block align-middle", icon.data],
    },
    variants: {
      column: {
        primary: {},
        secondary: {
          button: "w-full mx-0",
        },
        "call-to-action": {},
      },
      hasHeading: {
        true: {
          button: "text-2xl! py-4 px-10",
        },
        false: {
          button: "p-4",
        },
      },
      iconColor: {
        yellow: {
          icon: "text-yellow",
        },
        red: {
          icon: "text-red",
        },
      },
    },
  })({
    column: column,
    hasHeading: !!heading,
    iconColor: icon.color,
  });

  const analyticsHandler: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (analytics) {
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push({
        event: "customEvent",
        category: analytics.goal,
        action: analytics.action,
      });
    }
  };

  return (
    <>
      {heading && (
        <Typography type="h3" as="h2" className={classes.heading()}>
          <HtmlParser html={heading} />
        </Typography>
      )}

      <Button
        className={classes.button()}
        as={Link}
        href={url}
        color={color}
        outlined={outlined}
        onClick={analyticsHandler}
      >
        {icon && icon.data && <i className={classes.icon()} aria-hidden="true"></i>}
        <HtmlParser html={title} />
      </Button>
    </>
  );
};
