import { Select } from '@/components/select';

const config = {
	title: 'Components/Select',
	component: Select,
	parameters: {
		layout: 'centered',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className="w-96">
				<Story />
			</div>
		),
	],
};

export default config;

export const Default = {
	args: {
		options: [
			{
				value: 'option-1',
				label: 'Option 1',
			},
			{
				value: 'option-2',
				label: 'Option 2',
			},
			{
				value: 'option-3',
				label: 'Option 3',
			},
			{
				value: 'option-4',
				label: 'Option 4',
			},
			{
				value: 'option-5',
				label: 'Option 5',
			},
		],
	},
};

export const WithLabelAndDescription = {
	args: {
		options: [
			{
				value: 'option-1',
				label: 'Option 1',
			},
			{
				value: 'option-2',
				label: 'Option 2',
			},
			{
				value: 'option-3',
				label: 'Option 3',
			},
			{
				value: 'option-4',
				label: 'Option 4',
			},
			{
				value: 'option-5',
				label: 'Option 5',
			},
		],
		label: 'Example Select',
		description: 'This is an example Select',
	},
};

export const MultipleOptions = {
	args: {
		options: [
			{
				value: 'option-1',
				label: 'Option 1',
			},
			{
				value: 'option-2',
				label: 'Option 2',
			},
			{
				value: 'option-3',
				label: 'Option 3',
			},
			{
				value: 'option-4',
				label: 'Option 4',
			},
			{
				value: 'option-5',
				label: 'Option 5',
			},
		],
		multiple: true,
	},
};

export const Autocomplete = {
	args: {
		options: [
			{
				value: 'option-1',
				label: 'Option 1',
			},
			{
				value: 'option-2',
				label: 'Option 2',
			},
			{
				value: 'option-3',
				label: 'Option 3',
			},
			{
				value: 'option-4',
				label: 'Option 4',
			},
			{
				value: 'option-5',
				label: 'Option 5',
			},
		],
		autocomplete: true,
	},
};
