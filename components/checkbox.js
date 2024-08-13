import { Checkbox as HUICheckbox, Description, Field, Label } from '@headlessui/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@awesome.me/kit-7993323d0c/icons/classic/regular';
import { twJoin } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Checkbox = ({ checked = false, label, description, color = 'red', disabled = false, onChange }) => {
	const [enabled, setEnabled] = useState(checked);

	return (
		<Field className="flex flex-col gap-0.5">
			<div className="flex items-center gap-2">
				<HUICheckbox
					checked={enabled}
					onChange={(value) => {
						setEnabled(value);
						onChange?.(value);
					}}
					disabled={disabled}
					className={twJoin(
						'group flex size-4 items-center justify-center rounded border bg-white p-3 transition-colors',
						color === 'red' &&
							twJoin('focus-visible:ring-red', disabled ? 'ui-checked:bg-red/50' : 'ui-checked:bg-red'),
						color === 'yellow' &&
							twJoin('focus-visible:ring-yellow', disabled ? 'ui-checked:bg-yellow/50' : 'ui-checked:bg-yellow'),
						color === 'blue' &&
							twJoin('focus-visible:ring-blue', disabled ? 'ui-checked:bg-blue/50' : 'ui-checked:bg-blue'),
						color === 'green' &&
							twJoin('focus-visible:ring-green', disabled ? 'ui-checked:bg-green/50' : 'ui-checked:bg-green'),
						color === 'grey' &&
							twJoin('focus-visible:ring-grey', disabled ? 'ui-checked:bg-grey/50' : 'ui-checked:bg-grey'),
					)}
				>
					<FontAwesomeIcon
						className={twJoin(
							'h-5 w-5 opacity-0 transition-opacity',
							color === 'red' && 'text-white',
							color === 'yellow' && 'text-black',
							color === 'blue' && 'text-white',
							color === 'green' && 'text-white',
							color === 'grey' && 'text-black',
							disabled ? 'group-data-[checked]:opacity-70' : 'group-data-[checked]:opacity-100',
						)}
						icon={faCheck}
					/>
				</HUICheckbox>
				{label && <Label className={twJoin(disabled && 'text-gray-500')}>{label}</Label>}
			</div>

			{description && <Description className="text-sm text-gray-500">{description}</Description>}
		</Field>
	);
};

Checkbox.propTypes = {
	/**
	 * Specifies if the Checkbox should be checked initially
	 */
	checked: PropTypes.bool,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	color: PropTypes.oneOf(['red', 'yellow', 'blue', 'green', 'grey']),
	disabled: PropTypes.bool,
	onChange: PropTypes.func,
};
