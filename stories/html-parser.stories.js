import { HtmlParser } from '@/components/html-parser';
import { Divider } from '@/components/divider';

const config = {
	title: 'Components/HtmlParser',
	component: HtmlParser,
	parameters: {
		layout: 'padded',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
	argTypes: {
		instructions: { control: false },
	},
};

export default config;

export const Default = {
	args: {
		html: "<strong>Lorem Ipsum</strong>",
	},
};

export const WithCustomInstructions = {
	args: {
		html: "<strong>Lorem Ipsum</strong>",
		instructions: [
			{
				shouldProcessNode: (node) => node.tagName === 'strong',
				processNode: (node, children) => <span className="font-black text-red">{children}</span>,
			}
		]
	},
};