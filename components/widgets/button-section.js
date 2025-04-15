import { twJoin } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";
import { Button as ButtonComponent } from "@uoguelph/react-components/button";
import { HtmlParser } from "@/components/html-parser";
import { UnstyledLink } from "@/components/link";
import { tv } from "tailwind-variants";

const getTitle = (data) => {
  return data?.formattedTitle ? data.formattedTitle.processed : data.link?.title ? data.link.title : "No title entered";
};

const getColor = (style) => {
  switch (style) {
    case "Primary":
    case "Primary (Outline)":
      return "red";
    case "Secondary":
    case "Secondary (Outline)":
      return "black";
    case "Info":
    case "Info (Outline)":
      return "blue";
    default:
      return "none";
  }
};

const isOutlined = (style) => {
  return style.includes("Outline");
};

const getIconColor = (color) => {
  switch (color) {
    case "Yellow":
      return "text-yellow";
    case "Red":
      return "text-red";
    case "Darker Red":
      return "text-red-900";
    default:
      return "";
  }
};

export const Button = ({ column, data }) => {
  const url = data?.link?.url;
  const title = getTitle(data);
  const ctaHeading = data?.ctaHeading?.processed;
  const icon = data?.fontAwesomeIcon;
  const iconColor = getIconColor(data?.fontAwesomeIconColour?.name);
  const style = data?.style?.name;
  const color = getColor(style);
  const outlined = isOutlined(style);
  const analyticsGoal = data?.ctaAnalyticsGoal?.name;
  const analyticsAction = data?.ctaAnalyticsGoal?.action;

  const classes = tv({
    slots: {
      heading: "block text-black",
      button: "mb-3 me-3 font-medium flex items-center justify-start gap-x-1 leading-6",
      icon: ["pe-3 text-4xl inline-block align-middle", icon, iconColor],
    },
    variants: {
      column: {
        left: {
          button: "md:inline-flex",
        },
        right: "",
        Secondary: "",
      },
      hasHeading: {
        true: {
          button: "text-2xl! py-4 px-10",
        },
        false: {
          button: "p-4",
        },
      },
    },
  });

  const {
    heading: headingClasses,
    button: buttonClasses,
    icon: iconClasses,
  } = classes({
    column,
    hasHeading: !!ctaHeading,
  });

  const analyticsGoalHandler = (e) => {
    if (analyticsGoal && analyticsAction) {
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push({
        event: "customEvent",
        category: analyticsGoal,
        action: analyticsAction,
      });
    }
  };

  return (
    <>
      {ctaHeading && (
        <Typography type="h3" as="h2" className={headingClasses()} dangerouslySetInnerHTML={{ __html: ctaHeading }} />
      )}

      <ButtonComponent
        className={buttonClasses()}
        as={UnstyledLink}
        href={url}
        color={color}
        outlined={outlined}
        onClick={analyticsGoalHandler}
      >
        {icon && <i className={iconClasses()}></i>}
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
