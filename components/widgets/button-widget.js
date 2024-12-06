import { twJoin, twMerge } from "tailwind-merge";
import classNames from "classnames";

function setButtonStyle(buttonStyle) {
  switch (buttonStyle) {
    case "Primary":
      return "bg-red text-white hover:bg-red-900";
    case "Primary (Outline)":
      return "border-2 border-red hover:bg-red hover:text-white";
    case "Secondary":
      return "bg-grey-100 text-black hover:bg-grey-800";
    case "Secondary (Outline)":
      return "border-2 hover:bg-grey-100 hover:text-black";
    case "Info":
      return "bg-blue text-white hover:bg-blue-900";
    case "Info (Outline)":
      return "border-2 border-blue hover:bg-blue hover:text-white";
    default:
      return "bg-blue text-white";
  }
}

function setButtonIcon(buttonIcon, buttonIconClasses) {
  return <i className={twJoin(buttonIcon, buttonIconClasses)}></i>;
}

function fontAwesomeIconColour(colourChoice) {
  switch (colourChoice) {
    case "Yellow":
      return "text-yellow";
    case "Red":
      return "text-red";
    case "Darker Red":
      return "text-red-900";
    default:
      return "";
  }
}

export const Button = ({ buttonCol, buttonData }) => {
  let urlLink = buttonData?.link?.url;
  let buttonLinkTitle = buttonData?.formattedTitle
    ? buttonData.formattedTitle.processed
    : buttonData.link?.title
      ? buttonData.link.title
      : "No title entered";
  let buttonIcon = buttonData?.fontAwesomeIcon;
  let buttonIconColour = buttonData?.fontAwesomeIconColour?.name;
  let buttonStyle = buttonData?.style?.name;
  let buttonIconClasses = twJoin(
    "pe-3",
    "text-4xl",
    "inline-block",
    "align-middle",
    buttonIconColour ? fontAwesomeIconColour(buttonIconColour) : null
  );
  /*
    let btnAnalyticsGoal = buttonData.relationships.field_cta_analytics_goal?.name;
    let btnAnalyticsAction = buttonData.relationships.field_cta_analytics_goal?.field_goal_action;
  */

  let buttonClasses = twJoin(
    setButtonStyle(buttonStyle),
    "p-4",
    "mb-3",
    "font-medium",
    "text-lg",
    "me-3",
    "flex",
    "items-center",
    "gap-x-1",
    "leading-6",
    "block"
  );

  if (buttonCol !== "right" && buttonCol !== "Secondary") {
    buttonClasses = twJoin(buttonClasses, "md:inline-block");
  }

  return (
    <>
      <a className={buttonClasses} href={urlLink}>
        {buttonIcon && setButtonIcon(buttonIcon, buttonIconClasses)}
        <span className="align-middle inline-block" dangerouslySetInnerHTML={{ __html: buttonLinkTitle }} />
      </a>
    </>
  );
};
