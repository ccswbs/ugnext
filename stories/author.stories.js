import { Author } from '@/components/author';

const config = {
	title: 'Components/Author',
	component: Author,
	parameters: {
		layout: 'padded',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
};

export default config;

export const Red = {
	args: {
		name: 'Example Name',
		info: 'Enter a quote or other information about the author here',
		color: 'red',
	},
};

export const Yellow = {
	args: {
		name: 'Example Name',
		info: 'Enter a quote or other information about the author here',
		color: 'yellow',
	},
};
