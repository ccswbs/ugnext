import Banner from '@/components/banner';

const config = {
	title: 'Components/Banner',
	component: Banner,
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
		children: 'Example Banner',
		color: 'red',
	},
};

export const Yellow = {
	args: {
		children: 'Example Banner',
		color: 'yellow',
	},
};
