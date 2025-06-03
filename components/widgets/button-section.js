import { twJoin } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";
import { Button as ButtonComponent } from "@uoguelph/react-components/button";
import { HtmlParser } from "@/components/html-parser";
import { UnstyledLink } from "@/components/link";
import { tv } from "tailwind-variants";

function getButtonData(data) {
  const colors = {
    primary: "red",
    secondary: "black",
    info: "blue",
  };

  return {
    url: data?.link?.url,
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

export const Button = ({ column, data }) => {
  const { url, title, heading, color, icon, outlined, analytics } = getButtonData(data);

  const classes = tv({
    slots: {
      heading: "block text-black",
      button: "mb-3 font-medium flex items-center justify-start! gap-x-1 leading-6 mx-1",
      icon: ["pe-3 text-4xl inline-block align-middle", icon.data],
    },
    variants: {
      column: {
        left: {
          button: "md:inline-flex",
        },
        right: "",
        secondary: {
          button: "w-full mx-0",
        },
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
    column: column?.toLowerCase(),
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
        <Typography type="h3" as="h2" className={classes.heading()}>
          <HtmlParser html={heading} />
        </Typography>
      )}

      <ButtonComponent
        className={classes.button()}
        as={UnstyledLink}
        href={url}
        color={color}
        outlined={outlined}
        onClick={analyticsHandler}
      >
        {icon && <i className={classes.icon()}></i>}
        <HtmlParser html={title} />
      </ButtonComponent>
    </>
  );
};

export const ButtonSection = ({ data }) => {
  const buttons = data?.buttons;
  const column = data?.buttonSectionColumn?.name;

  return (
    <>{buttons?.length > 0 && buttons.map((button) => <Button key={button.id} column={column} data={button} />)}</>
  );
};
