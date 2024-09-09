import { Button } from '@/components/button';

const config = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
	argTypes: {
		as: { control: false },
		children: { control: false },
		href: { control: false },
		className: { control: false },
	},
};

export default config;

export const RedNotOutlined = {
	args: {
		color: 'red',
		children: 'Example Button',
		outlined: false,
		disabled: false,
	},
};

export const RedOutlined = {
	args: {
		color: 'red',
		children: 'Example Button',
		outlined: true,
		disabled: false,
	},
};

export const YellowNotOutlined = {
	args: {
		color: 'yellow',
		children: 'Example Button',
		outlined: false,
		disabled: false,
	},
};

export const YellowOutlined = {
	args: {
		color: 'yellow',
		children: 'Example Button',
		outlined: true,
		disabled: false,
	},
};

export const BlueNotOutlined = {
	args: {
		color: 'blue',
		children: 'Example Button',
		outlined: false,
		disabled: false,
	},
};

export const BlueOutlined = {
	args: {
		color: 'blue',
		children: 'Example Button',
		outlined: true,
		disabled: false,
	},
};

export const GreenNotOutlined = {
	args: {
		color: 'green',
		children: 'Example Button',
		outlined: false,
		disabled: false,
	},
};

export const GreenOutlined = {
	args: {
		color: 'green',
		children: 'Example Button',
		outlined: true,
		disabled: false,
	},
};

export const GreyNotOutlined = {
	args: {
		color: 'grey',
		children: 'Example Button',
		outlined: false,
		disabled: false,
	},
};

export const GreyOutlined = {
	args: {
		color: 'grey',
		children: 'Example Button',
		outlined: true,
		disabled: false,
	},
};

export const DisabledNotOutlined = {
	args: {
		color: 'red',
		children: 'Example Button',
		outlined: false,
		disabled: true,
	},
};

export const DisabledOutlined = {
	args: {
		color: 'red',
		children: 'Example Button',
		outlined: true,
		disabled: true,
	},
};
