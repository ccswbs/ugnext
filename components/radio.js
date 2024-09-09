import { Field, Fieldset, Legend, Label, Radio as HUIRadio, RadioGroup } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { twJoin } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Radio = ({ options, label, name, inline = false, onChange }) => {
	let [selected, setSelected] = useState(options.find((option) => option?.selected) ?? null);

	return (
		<Fieldset className="flex flex-col gap-0.5">
			{label && <Legend>{label}</Legend>}

			<RadioGroup
				name={name}
				by="value"
				value={selected}
				onChange={(value) => {
					setSelected(value);
					onChange?.(value);
				}}
				className={twJoin('flex gap-2', !inline && 'flex-col')}
			>
				{options?.map((item, index) => (
					<Field className="flex items-center gap-0.5" key={index}>
						<HUIRadio value={item} as={Fragment}>
							{({ checked, disabled }) => (
								<span
									className={twJoin(
										'block aspect-square rounded-full border border-blue p-1.5 focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2',
										checked && 'bg-blue',
									)}
								>
									<span className={twJoin('block h-2 w-2 rounded-full', checked ? 'bg-white' : 'bg-transparent')} />
								</span>
							)}
						</HUIRadio>
						<Label>{item?.label}</Label>
					</Field>
				))}
			</RadioGroup>
		</Fieldset>
	);
};

Radio.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			selected: PropTypes.bool,
			label: PropTypes.string,
			value: PropTypes.any,
		}),
	).isRequired,
	label: PropTypes.string,
	/**
	 * The name of the radio when inside a HTML form
	 */
	name: PropTypes.string,
	/**
	 * Whether to display the Radios next to each other
	 */
	inline: PropTypes.bool,
	onChange: PropTypes.func,
};
