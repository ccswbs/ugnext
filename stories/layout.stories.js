import { Layout } from '@/components/layout';
import { Container } from '@/components/container';

const config = {
	title: 'Components/Layout',
	component: Layout,
	parameters: {
		layout: 'fullScreen',
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
		children: (
			<Container centered>
				Fugiat odit reprehenderit optio laboriosam itaque asperiores consequuntur. Vitae amet quibusdam sit rerum quas
				at provident. Sapiente ipsam molestias aspernatur. Veritatis praesentium voluptatibus nemo beatae architecto
				repudiandae quidem. Neque omnis dignissimos rem culpa omnis enim eos. Quas vitae fuga molestiae ratione error
				sequi architecto ad.
			</Container>
		),
	},
};
