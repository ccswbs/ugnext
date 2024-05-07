import React, { useMemo } from 'react';
import { useState } from 'react';
import {
	Description,
	Field,
	Label,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from '@headlessui/react';
import { twJoin } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@awesome.me/kit-7993323d0c/icons/classic/regular';

export const Select = ({ onChange, children, multiple = false, label, description, placeholder = 'Select a value...' }) => {
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
		'flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 shadow-sm transition-colors group-focus-within:border-blue group-focus-within:outline-none ui-open:rounded-b-none ui-open:border-blue',
	);
	const placeholderClasses = twJoin('text-gray-600');
	const buttonIconClasses = twJoin('h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180');
	const optionsContainerClasses = twJoin(
		'z-10 max-h-[20rem] w-full overflow-auto rounded-b-md border border-t-0 border-gray-300 bg-white shadow-md transition-colors group-focus-within:border-blue group-focus-within:outline-none ui-open:border-blue md:absolute',
	);
	const optionClasses = twJoin(
		'relative cursor-pointer select-none border-b border-gray-300 px-4 py-2 text-gray-900 transition-colors last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ui-active:bg-gray-100',
	);

	const buttonText = multiple ? selected[0]?.children : selected?.children;

	return (
		<Field className="flex flex-col gap-0.5">
			{label && <Label>{label}</Label>}

			<Listbox
				value={selected}
				by="value"
				onChange={handleOnChange}
				as="div"
				className={containerClasses}
				multiple={multiple}
			>
				<ListboxButton className={buttonClasses}>
					{buttonText ? <span>{buttonText}</span> : <span className={placeholderClasses}>{placeholder}</span>}
					<FontAwesomeIcon className={buttonIconClasses} icon={faChevronDown} />
				</ListboxButton>
				<Transition
					enter="transition-opacity duration-100 ease-out"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-100 ease-out"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<ListboxOptions className={optionsContainerClasses}>
						{options.map((option, index) => (
							<ListboxOption className={optionClasses} key={option?.value} value={option} disabled={option?.disabled}>
								{({ focus, selected }) => (
									<>
										{option?.children}

										{selected && (
											<span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-blue-600 ui-selected:flex">
												<FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
											</span>
										)}
									</>
								)}
							</ListboxOption>
						))}
					</ListboxOptions>
				</Transition>
			</Listbox>

			{description && <Description className="text-sm text-gray-500">{description}</Description>}
		</Field>
	);
};

// This is a dummy component to be used in Select component, it does nothing as the Select component will handle the rendering, we just use this to hold the data associated with the option.
export const Option = ({ value, children, selected = false, disabled = false }) => '';
