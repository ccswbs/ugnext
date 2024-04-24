import React from 'react';
import { Tab as HUITab } from '@headlessui/react';
import { twJoin } from 'tailwind-merge';

export const Tab = ({ children, title }) => <></>;

export const Tabs = ({ children, data }) => {
	const tabs = React.Children.toArray(children).filter((child) => child?.type?.name === 'Tab');
	const tabClasses = twJoin();
	const tabPanelClasses = twJoin();

	return (
		<HUITab.Group>
			<HUITab.List>
				{tabs.map((child, index) => (
					<HUITab key={index} className={tabClasses}>
						{child?.props.title}
					</HUITab>
				))}
			</HUITab.List>
			<HUITab.Panels>
				{tabs.map((child, index) => (
					<HUITab.Panel key={index} className={tabPanelClasses}>
						{child?.props.children}
					</HUITab.Panel>
				))}
			</HUITab.Panels>
		</HUITab.Group>
	);
};

export default Tabs;
