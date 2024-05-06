import React, { useMemo } from 'react';
import { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { twJoin } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@awesome.me/kit-7993323d0c/icons/classic/regular';

const Select = ({ onChange, children }) => {
	const options = useMemo(() => {
		return React.Children.toArray(children)
			.filter((child) => child?.type?.name === 'Option')
			.map((child) => ({
				...child?.props,
				value: child?.props?.value ?? (typeof child?.props?.children === 'string' && child?.props?.children),
			}));
	}, [children]);

	const [selected, setSelected] = useState(options.find((option) => option?.selected) ?? options[0]);
	const handleOnChange = (option) => {
		setSelected(option);
		onChange?.(option);
	};

	const containerClasses = twJoin('group relative');
	const buttonClasses = twJoin(
		'flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 shadow-sm group-focus-within:border-blue group-focus-within:outline-none ui-open:rounded-b-none',
	);
	const buttonIconClasses = twJoin('h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180');
	const optionsContainerClasses = twJoin(
		'absolute z-10 w-full rounded-b-md border border-t-0 border-gray-300 bg-white shadow-md group-focus-within:border-blue group-focus-within:outline-none',
	);
	const optionClasses = twJoin(
		'relative cursor-pointer select-none border-b border-gray-300 px-4 py-2 text-gray-900 transition-colors last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ui-active:bg-gray-100',
	);

	return (
		<Listbox value={selected} by="value" onChange={handleOnChange} as="div" className={containerClasses}>
			<Listbox.Button className={buttonClasses}>
				<span>{selected.children}</span>
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
							{selected?.value === option?.value && (
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
