import { Description, Field, Input, Label } from '@headlessui/react';
import PropTypes from 'prop-types';

export const TextInput = ({ value, type = 'text', placeholder = '', onInput, label, description, ...rest }) => (
	<Field className="flex flex-col gap-0.5">
		{label && <Label>{label}</Label>}

		<Input
			value={value}
			type={type}
			placeholder={placeholder}
			onInput={(e) => onInput(e?.target?.value)}
			{...rest}
			className="rounded-md border border-gray-300 px-4 py-2 transition-colors focus:border-blue focus:outline-none"
		/>

		{description && <Description className="text-sm text-gray-500">{description}</Description>}
	</Field>
);

TextInput.propTypes = {
	/**
	 * Sets the initial value of the TextInput
	 */
	value: PropTypes.string,
	type: PropTypes.oneOf(['text', 'password']),
	placeholder: PropTypes.string,
	onInput: PropTypes.func,
	label: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
	description: PropTypes.string,
};
