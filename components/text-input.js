import { twMerge } from 'tailwind-merge';
import { Description, Field, Input, Label } from '@headlessui/react';

export const TextInput = ({
	value,
	type = 'text',
	placeholder = '',
	onInput,
	className,
	label,
	description,
	...rest
}) => (
	<Field className="flex flex-col gap-0.5">
		{label && <Label>{label}</Label>}

		<Input
			value={value}
			type={type}
			placeholder={placeholder}
			onInput={(e) => onInput(e?.target?.value)}
			{...rest}
			className={twMerge(
				'rounded-md border border-gray-300 px-4 py-2 transition-colors focus:border-blue focus:outline-none',
				className,
			)}
		/>

		{description && <Description className="text-sm text-gray-500">{description}</Description>}
	</Field>
);
