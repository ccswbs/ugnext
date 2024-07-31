import { Heading } from '@/components/heading';

const config = {
	title: 'Components/Heading',
	component: Heading,
	parameters: {
		layout: 'padded',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
	argTypes: {
		children: { control: false },
		className: { control: false },
	},
};

export default config;

export const H1 = {
	storyName: "H1",
	args: {
		level: 1,
		children: "Example H1 heading",
	},
};

export const H2 = {
	storyName: "H2",
	args: {
		level: 2,
		children: "Example H2 heading",
	},
};

export const H3 = {
	storyName: "H3",
	args: {
		level: 3,
		children: "Example H3 heading",
	},
};

export const H4 = {
	storyName: "H4",
	args: {
		level: 4,
		children: "Example H4 heading",
	},
};

export const H5 = {
	storyName: "H5",
	args: {
		level: 5,
		children: "Example H5 heading",
	},
};

export const H6 = {
	storyName: "H6",
	args: {
		level: 6,
		children: "Example H6 heading",
	},
};


export const H3StylesAsH1 = {
	storyName: "H3 Styles As H1",
	args: {
		level: 3,
		children: "Example H1 heading with H3 styles",
		as: 'h1'
	},
};
