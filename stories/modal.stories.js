import { Modal } from '@/components/modal';

const config = {
	title: 'Components/Modal',
	component: Modal,
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
		children: <div>Whatever content you want here</div>,
		open: false
	},
};
