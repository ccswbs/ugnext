import { Checkbox } from '@/components/checkbox';
import { fn } from '@storybook/test';

const config = {
	title: 'Components/Checkbox',
	component: Checkbox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onChange: fn(),
	},
};

export default config;

export const Basic = {
	args: {
		color: 'red',
		disabled: false,
		checked: false,
	},
};

export const WithLabel = {
	args: {
		color: 'red',
		disabled: false,
		checked: false,
		label: 'Example checkbox',
	},
};

export const WithLabelAndDescription = {
	args: {
		color: 'red',
		disabled: false,
		checked: false,
		label: 'Example checkbox',
		description: 'This is a checkbox',
	},
};

export const CheckedByDefault = {
	args: {
		color: 'red',
		disabled: false,
		checked: true,
		label: 'Example checkbox',
		description: 'This is a checkbox',
	},
};

export const DisabledAndUnchecked = {
	args: {
		color: 'red',
		disabled: true,
		checked: false,
		label: 'Example checkbox',
		description: 'This is a checkbox',
	},
};

export const DisabledAndChecked = {
	args: {
		color: 'red',
		disabled: true,
		checked: true,
		label: 'Example checkbox',
		description: 'This is a checkbox',
	},
};
