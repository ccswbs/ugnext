import { Tabs } from '@/components/tabs';

const config = {
	title: 'Components/Tabs',
	component: Tabs,
	parameters: {
		layout: 'padded',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
};

export default config;

export const Default = {
	args: {
		tabs: [
			{
				content: <div>Example Tab 1 Content</div>,
				title: 'Example Tab 1',
			},
			{
				content: <div>Example Tab 2 Content</div>,
				title: 'Example Tab 2',
			},
			{
				content: <div>Example Tab 3 Content</div>,
				title: 'Example Tab 3',
			},
			{
				content: <div>Example Tab 4 Content</div>,
				title: 'Example Tab 4',
			},
		],
		fullWidth: false,
	},
};

export const FullWidth = {
	args: {
		tabs: [
			{
				content: <div>Example Tab 1 Content</div>,
				title: 'Example Tab 1',
			},
			{
				content: <div>Example Tab 2 Content</div>,
				title: 'Example Tab 2',
			},
			{
				content: <div>Example Tab 3 Content</div>,
				title: 'Example Tab 3',
			},
			{
				content: <div>Example Tab 4 Content</div>,
				title: 'Example Tab 4',
			},
		],
		fullWidth: true,
	},
};
