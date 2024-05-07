import { Checkbox as HUICheckbox, Description, Field, Label } from '@headlessui/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@awesome.me/kit-7993323d0c/icons/classic/regular';
import { twJoin } from 'tailwind-merge';

export const Checkbox = ({ checked = false, label, description, color = 'red', disabled = false }) => {
	const [enabled, setEnabled] = useState(checked);

	return (
		<Field className="flex flex-col gap-0.5">
			<div className="flex items-center gap-2">
				<HUICheckbox
					checked={enabled}
					onChange={setEnabled}
					disabled={disabled}
					className={twJoin(
						'group flex size-4 items-center justify-center rounded border bg-white p-3 transition-colors',
						color === 'red' && 'focus-visible:ring-red ui-checked:bg-red',
						color === 'yellow' && 'focus-visible:ring-yellow ui-checked:bg-yellow',
						color === 'blue' && 'focus-visible:ring-blue ui-checked:bg-blue',
						color === 'green' && 'focus-visible:ring-green ui-checked:bg-green',
						color === 'grey' && 'focus-visible:ring-grey ui-checked:bg-grey',
					)}
				>
					<FontAwesomeIcon
						className={twJoin(
							'h-5 w-5 opacity-0 transition-opacity group-data-[checked]:opacity-100',
							color === 'red' && 'text-white',
							color === 'yellow' && 'text-black',
							color === 'blue' && 'text-white',
							color === 'green' && 'text-white',
							color === 'grey' && 'text-black',
						)}
						icon={faCheck}
					/>
				</HUICheckbox>
				{label && <Label>{label}</Label>}
			</div>

			{description && <Description className="text-sm text-gray-500">{description}</Description>}
		</Field>
	);
};
