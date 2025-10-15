"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Button } from "@uoguelph/react-components/button";
import { HtmlParser } from "@/components/client/html-parser";
import { tv } from "tailwind-variants";
import { Container } from "@uoguelph/react-components/container";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import Link from "next/link";
import { collapseSlashes } from "@/lib/string-utils";

function getButtonData(data) {
  const colors = {
    primary: "red",
    secondary: "black",
    info: "blue",
  };

  let url = data?.link?.url;

  if (url.startsWith("/sites/default/files")) {
    const base = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "https://api.liveugconthub.uoguelph.dev";
    url = collapseSlashes(`${base}/${url}`);
  }

  return {
    url: url,
    title: data?.formattedTitle ? data.formattedTitle.processed : data.link?.title ? data.link.title : "",
    heading: data?.ctaHeading?.processed,
    color: colors[data?.style?.name?.toLowerCase()?.replace("(outline)", "").trim()] ?? "red",
    icon: {
      data: data?.fontAwesomeIcon,
      color: data?.fontAwesomeIconColour?.name?.toLowerCase()?.replace("darker", "")?.trim(),
    },
    outlined: Boolean(data?.style?.name?.includes("Outline")),
    analytics: data?.ctaAnalyticsGoal
      ? {
          goal: data?.ctaAnalyticsGoal?.name,
          action: data?.ctaAnalyticsGoal?.action,
        }
      : null,
  };
}

export const ButtonWidget = ({ data, column }) => {
  const { url, title, heading, color, icon, outlined, analytics } = getButtonData(data);

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

  const analyticsHandler = (e) => {
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
        <>
        <Typography id={`button-heading-${data.uuid}`} type="h3" as="h2" className={classes.heading()}>
          <HtmlParser html={heading} />
        </Typography>
        <div className="basis-full h-0"></div>
        </>
      )}

      <Button
        id={`button-${data.uuid}`}
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

export const ButtonSectionWidget = ({ data }) => {
  const buttons = data?.buttons;
  const column = data?.buttonSectionColumn?.name?.toLowerCase()?.replaceAll(" ", "-") ?? "primary";
  const context = useContext(SectionContext);

  const classes = tv({
    base: "flex gap-2 pt-4",
    variants: {
      column: {
        primary: "flex flex-wrap px-0 mx-0",
        secondary: "flex-col px-0 mx-0",
        "call-to-action": "flex-wrap flex-row items-center",
      },
    },
  })({ column, section: context?.column ?? "primary" });

  return (
    <Container id={`button-section-${data.uuid}`} className={classes}>
      {buttons?.length > 0 && buttons.map((button) => <ButtonWidget key={button.id} column={column} data={button} />)}
    </Container>
  );
};
