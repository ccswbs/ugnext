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

	const containerClasses = twJoin('relative');
	const buttonClasses = twJoin(
		'flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ui-open:rounded-b-none',
	);
	const buttonIconClasses = twJoin('h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180');

	const optionsContainerClasses = twJoin('absolute z-10 w-full rounded-b-md bg-white shadow-md');
	const optionClasses = twJoin(
		'relative cursor-pointer select-none border-b border-gray-300 py-2 pl-3 pr-9 text-gray-900 last:border-b-0',
	);

	return (
		<Listbox value={selected} by="value" onChange={setSelected} as="div" className={containerClasses}>
			<Listbox.Button className={buttonClasses}>
				<span>{selected.children}</span>
				<FontAwesomeIcon className={buttonIconClasses} icon={faChevronDown} />
			</Listbox.Button>
			<Transition
				enter="transition duration-100 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
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
