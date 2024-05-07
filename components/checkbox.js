import { Checkbox as HUICheckbox, Description, Field, Label } from '@headlessui/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@awesome.me/kit-7993323d0c/icons/classic/regular';

const Checkbox = ({ checked = false, label, description }) => {
	const [enabled, setEnabled] = useState(checked);

	return (
		<Field>
			<div className="flex items-center gap-2">
				<HUICheckbox
					checked={enabled}
					onChange={setEnabled}
					className="group flex size-4 items-center justify-center rounded border bg-white p-3 transition-colors ui-checked:bg-blue-500"
				>
					<FontAwesomeIcon
						className="h-5 w-5 opacity-0 transition-opacity text-white group-data-[checked]:opacity-100"
						icon={faCheck}
					/>
				</HUICheckbox>
				{label && <Label>{label}</Label>}
			</div>

			{description && <Description className="text-sm text-gray-500">{description}</Description>}
		</Field>
	);
};

export default Checkbox;
