import { Link } from '@/components/link';
import { Profile } from '@/components/profile';

const config = {
	title: 'Components/Profile',
	component: Profile,
	parameters: {
		layout: 'centered',
		docs: {
			toc: true,
		},
	},
	argTypes: {
		body: { control: false },
		footer: { control: false },
	},
	tags: ['autodocs'],
};

export default config;

export const NoFooter = {
	args: {
		image: {
			width: 150,
			height: 150,
			src: 'https://picsum.photos/seed/hero/150/150',
			alt: 'Example Image',
		},
		body: (
			<span>
				Itaque possimus amet quo fugiat in cumque. Dolores ipsa neque adipisci dolores architecto voluptas omnis
				quibusdam. Accusantium sunt atque rem modi. Nesciunt cupiditate cum consectetur repellat vero. Deleniti
				accusamus porro. Aperiam ipsam placeat commodi laborum inventore amet.
			</span>
		),
	},
};

export const WithFooter = {
	args: {
		image: {
			width: 150,
			height: 150,
			src: 'https://picsum.photos/seed/hero/150/150',
			alt: 'Example Image',
		},
		body: (
			<span>
				Itaque possimus amet quo fugiat in cumque. Dolores ipsa neque adipisci dolores architecto voluptas omnis
				quibusdam. Accusantium sunt atque rem modi. Nesciunt cupiditate cum consectetur repellat vero. Deleniti
				accusamus porro. Aperiam ipsam placeat commodi laborum inventore amet.
			</span>
		),
		footer: <span>Example Footer</span>,
	},
};
