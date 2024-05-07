import React, { useMemo } from 'react';
import { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { twJoin } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@awesome.me/kit-7993323d0c/icons/classic/regular';

const Select = ({ onChange, children, multiple = false, placeholder = 'Select a value...' }) => {
	const options = useMemo(() => {
		return React.Children.toArray(children)
			.filter((child) => child?.type?.name === 'Option')
			.map((child) => ({
				...child?.props,
				value: child?.props?.value ?? (typeof child?.props?.children === 'string' && child?.props?.children),
			}));
	}, [children]);

	const defaultSelected = multiple
		? options.filter((option) => option?.selected) ?? []
		: options.find((option) => option?.selected) ?? null;

	const [selected, setSelected] = useState(defaultSelected);
	const handleOnChange = (option) => {
		setSelected(multiple ? [...option] : option);
		onChange?.(option);
	};

	const containerClasses = twJoin('group relative');
	const buttonClasses = twJoin(
		'flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 shadow-sm group-focus-within:border-blue group-focus-within:outline-none ui-open:rounded-b-none ui-open:border-blue',
	);
	const placeholderClasses = twJoin('text-gray-600');
	const buttonIconClasses = twJoin('h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180');
	const optionsContainerClasses = twJoin(
		'z-10 max-h-[20rem] w-full overflow-auto rounded-b-md border border-t-0 border-gray-300 bg-white shadow-md group-focus-within:border-blue group-focus-within:outline-none ui-open:border-blue md:absolute',
	);
	const optionClasses = twJoin(
		'relative cursor-pointer select-none border-b border-gray-300 px-4 py-2 text-gray-900 transition-colors last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ui-active:bg-gray-100',
	);

	const buttonText = multiple ? selected[0]?.children : selected?.children;

	return (
		<Listbox
			value={selected}
			by="value"
			onChange={handleOnChange}
			as="div"
			className={containerClasses}
			multiple={multiple}
		>
			<Listbox.Button className={buttonClasses}>
				{buttonText ? <span>{buttonText}</span> : <span className={placeholderClasses}>{placeholder}</span>}
				<FontAwesomeIcon className={buttonIconClasses} icon={faChevronDown} />
			</Listbox.Button>
			<Transition
				enter="transition duration-100 ease-out"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<Listbox.Options className={optionsContainerClasses}>
					{options.map((option, index) => (
						<Listbox.Option className={optionClasses} key={option?.value} value={option} disabled={option?.disabled}>
							{option?.children}
							{(selected?.some?.((opt) => opt?.value === option?.value) || selected?.value === option?.value) && (
								<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
									<FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
								</span>
							)}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
};

const Option = ({ value, children, selected = false, disabled = false }) => '';

Select.Option = Option;

export default Select;
