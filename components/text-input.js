import { twMerge } from 'tailwind-merge';

const TextInput = ({ value, type = 'text', placeholder = '', onInput, className, ...rest }) => {
	return (
		<input
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
	);
};

export default TextInput;
