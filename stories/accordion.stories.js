import { Accordion } from '@/components/accordion';

const config = {
	title: 'Components/Accordion',
	component: Accordion,
	parameters: {
		layout: 'padded',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
	argTypes: {
		children: { control: false },
	},
};

export default config;

export const Default = {
	args: {
		title: 'Example Title',
		children: (
			<div>
				Iusto possimus possimus delectus et. Et aspernatur culpa quis sint at nam voluptatibus. Occaecati perspiciatis
				ea eius dolorem aliquid. Ad ducimus aut aspernatur. Cumque enim repellat reprehenderit. Similique perspiciatis
				alias doloremque reprehenderit eum. A laboriosam dolore. Facere possimus qui. Voluptas quas dicta hic adipisci
				voluptatibus impedit consectetur quae veniam. Totam amet magni. Vero voluptas dolorum itaque praesentium sint
				quasi accusamus. Culpa consequuntur doloribus sint. Pariatur sequi consequuntur quidem enim exercitationem.
				Culpa repellendus eveniet fugit cum. Sapiente doloribus recusandae ex autem.
			</div>
		),
	},
};
