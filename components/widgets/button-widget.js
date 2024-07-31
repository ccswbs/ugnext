import { twJoin, twMerge } from 'tailwind-merge';
import { UnstyledLink } from '@/components/link';

function setButtonStyle(buttonStyle) {
  switch (buttonStyle) {
    case 'Primary':
      return 'bg-red text-white hover:bg-red-900';
    case 'Primary (Outline)':
      return 'text-red border-2 border-red hover:bg-red hover:text-white';
    case 'Secondary':
      return 'bg-gray-500 text-white';
    case 'Secondary (Outline)':
      return 'border border-gray-500 text-gray-500';
    case 'Info':
      return 'bg-teal-500 text-white';
    case 'Info (Outline)':
      return 'border border-teal-500 text-teal-500';
    case 'Success':
      return 'bg-green-500 text-white';
    case 'Success (Outline)':
      return 'border border-green-500 text-green-500';
    case 'Warning':
      return 'bg-yellow-500 text-white';
    case 'Warning (Outline)':
      return 'border border-yellow-500 text-yellow-500';
    case 'Danger':
      return 'bg-red-500 text-white';
    case 'Danger (Outline)':
      return 'border border-red-500 text-red-500';
    case 'Light':
      return 'bg-gray-100 text-gray-800';
    case 'Light (Outline)':
      return 'border border-gray-100 text-gray-800';
    case 'Dark':
      return 'bg-gray-800 text-white';
    case 'Dark (Outline)':
      return 'border border-gray-800 text-gray-800';
    default:
      return 'bg-blue-500 text-white';
  }
}

export const Button = ({ buttonCol, buttonData }) => {
  let urlLink = buttonData?.link?.url;
  let buttonLinkTitle = buttonData?.link?.title;
  let buttonIcon = buttonData?.fontAwesomeIcon;
  let buttonIconColour = buttonData?.fontAwesomeIconColour?.name;
  let buttonStyle = buttonData?.style?.name;
  /*let buttonClasses = classNames('btn', buttonStyle(buttonData.relationships.field_button_style?.name), buttonSpacing, 'no-icon', 'p-4');
    let buttonFontAwesomeClasses = classNames('align-middle','display-2','pe-3', buttonIcon, (buttonIconColour ? fontAwesomeIconColour(buttonIconColour) : null));
    let btnAnalyticsGoal = buttonData.relationships.field_cta_analytics_goal?.name;
    let btnAnalyticsAction = buttonData.relationships.field_cta_analytics_goal?.field_goal_action;
    let buttonTitleClasses = classNames('align-middle','lh-sm'); */

  let buttonClasses = twJoin(setButtonStyle(buttonStyle), 'p-3', 'mb-3', 'block', 'font-medium', 'text-lg');

  return (
    <>
      <a className={buttonClasses} href={urlLink}>
        {buttonLinkTitle}
      </a>
    </>
  );
};
