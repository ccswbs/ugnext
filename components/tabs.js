import React from 'react';
import { Tab as HUITab } from '@headlessui/react';
import { twJoin } from 'tailwind-merge';

const Tabs = ({ fullWidth = true, children }) => {
	const tabs = React.Children.toArray(children).filter((child) => child?.type?.name === 'Tab');
	const containerClasses = twJoin('flex gap-1 border-b-4 border-yellow', fullWidth ? 'w-full' : 'w-fit');
	const tabClasses = twJoin(
		'mb-1 rounded-t-sm bg-gray-200 px-4 py-3 text-lg font-bold text-black transition-colors hover:bg-gray-300 focus:bg-grey-300 focus:outline-none ui-selected:mb-0 ui-selected:border-2 ui-selected:border-yellow ui-selected:bg-yellow',
		fullWidth && 'flex-1',
	);
	const tabPanelClasses = twJoin('py-4');

	return (
		<HUITab.Group>
			<HUITab.List className={containerClasses}>
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

// This is a dummy component to be used in Tabs component, it does nothing as the Tabs component will handle the rendering, we just use this to hold the data associated with the tab (it's title and content).
const Tab = ({ children, title }) => '';

Tabs.Tab = Tab;
export default Tabs;
