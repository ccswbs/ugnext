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

export const Select = ({
	onChange,
	options,
	multiple = false,
	label,
	name,
	description,
	placeholder = 'Select a value',
}) => {
	const [selected, setSelected] = useState(
		multiple ? options.filter((option) => option?.selected) ?? [] : options.find((option) => option?.selected) ?? null,
	);

	// Create a map of the indices of the options by their value for faster lookup when sorting the selected options
	const indices = useMemo(
		() => options.reduce((acc, option, index) => acc.set(option?.value, index), new Map()),
		[options],
	);
	const handleOnChange = (option) => {
		const selected = multiple
			? // Sort the selected options by their original order as was passed in the options prop
				[...option].sort((a, b) => (indices.get(a?.value) ?? 0) - (indices.get(b?.value) ?? 0))
			: option;

		setSelected(selected);
		onChange?.(option);
	};

	return (
		<Field className="flex flex-col gap-0.5">
			{label && <Label>{label}</Label>}

			<Listbox
				name={name}
				value={selected}
				by="value"
				onChange={handleOnChange}
				as="div"
				className="group relative"
				multiple={multiple}
			>
				<ListboxButton className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 shadow-sm transition-colors group-focus-within:border-blue group-focus-within:outline-none ui-open:rounded-b-none ui-open:border-blue">
					<span className={twJoin('truncate', (!selected || selected?.length === 0) && 'text-gray-400')}>
						{selected?.reduce?.(
							(acc, option, index) => `${acc}${option?.label}${index < selected?.length - 1 ? ', ' : ''}`,
							'',
						) ||
							selected?.label ||
							placeholder}
					</span>
					<FontAwesomeIcon
						className="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180"
						icon={faChevronDown}
					/>
				</ListboxButton>
				<Transition
					enter="transition-opacity duration-100 ease-out"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity duration-100 ease-out"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<ListboxOptions className="z-10 max-h-[20rem] w-full overflow-auto rounded-b-md border border-t-0 border-gray-300 bg-white shadow-md transition-colors group-focus-within:border-blue group-focus-within:outline-none ui-open:border-blue md:absolute">
						{options.map((option, index) => (
							<ListboxOption
								className="relative cursor-pointer select-none border-b border-gray-300 px-4 py-2 text-gray-900 transition-colors last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ui-active:bg-gray-100"
								key={option?.value}
								value={option}
								disabled={option?.disabled}
							>
								{({ focus, selected }) => (
									<>
										{option?.label}

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
