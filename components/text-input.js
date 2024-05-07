import { twMerge } from 'tailwind-merge';
import { Description, Field, Input, Label } from '@headlessui/react';

const TextInput = ({ value, type = 'text', placeholder = '', onInput, className, label, description, ...rest }) => {
	return (
		<Field className="flex flex-col gap-0.5">
			{label && <Label>{label}</Label>}

			<Input
				value={value}
				type={type}
				placeholder={placeholder}
				onInput={onInput}
				{...rest}
				className={twMerge(
					'w-full rounded-md border border-gray-300 px-4 py-2 transition-colors focus:border-blue focus:outline-none',
					className,
				)}
			/>

			{description && <Description className="text-sm text-gray-500">{description}</Description>}
		</Field>
	);
};

export default TextInput;
