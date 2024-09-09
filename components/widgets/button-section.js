import { twJoin } from 'tailwind-merge';
import { Heading } from '@/components/heading';
import { Button as ButtonComponent } from '@/components/button';
import { HtmlParser } from '@/components/html-parser';

const getTitle = (data) => {
	return data?.formattedTitle ? data.formattedTitle.processed : data.link?.title ? data.link.title : 'No title entered';
};

const getColor = (style) => {
	switch (style) {
		case 'Primary':
		case 'Primary (Outline)':
			return 'red';
		case 'Secondary':
		case 'Secondary (Outline)':
			return 'black';
		case 'Info':
		case 'Info (Outline)':
			return 'blue';
		default:
			return 'none';
	}
};

const isOutlined = (style) => {
	return style.includes('Outline');
};

const getIconColor = (color) => {
	switch (color) {
		case 'Yellow':
			return 'text-yellow';
		case 'Red':
			return 'text-red';
		case 'Darker Red':
			return 'text-red-900';
		default:
			return '';
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
	/*
    let btnAnalyticsGoal = buttonData.relationships.field_cta_analytics_goal?.name;
    let btnAnalyticsAction = buttonData.relationships.field_cta_analytics_goal?.field_goal_action;
  */

	return (
		<>
			{ctaHeading && (
				<Heading level={3} as={'h2'} className="block text-black" dangerouslySetInnerHTML={{ __html: ctaHeading }} />
			)}

			<ButtonComponent
				className={twJoin(
					'mb-3 me-3 font-medium flex items-center justify-start gap-x-1 leading-6',
					ctaHeading ? 'text-2xl py-4 px-10' : 'p-4',
					column !== 'right' && column !== 'Secondary' && 'md:inline-flex',
				)}
				href={url}
				color={color}
				outlined={outlined}
			>
				{icon && <i className={twJoin('pe-3 text-4xl inline-block align-middle', icon, iconColor)}></i>}
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
