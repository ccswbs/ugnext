import Notification from '@/components/notification';

const config = {
	title: 'Components/Notification',
	component: Notification,
	parameters: {
		layout: 'fullscreen',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
};

export default config;

export const Red = {
	args: {
		children: 'Example Notification',
		color: 'red',
	},
};

export const Yellow = {
	args: {
		children: 'Example Notification',
		color: 'yellow',
	},
};
