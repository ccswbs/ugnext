import { TextInput } from '@/components/text-input';
import { Select } from '@/components/select';
import { toTitleCase } from '@/lib/string-utils';
import { useSearch } from '@/lib/use-search';
import { useMemo, useState } from 'react';
import { UnstyledLink } from '@/components/link';

export const ProgramSearch = ({ programs, children, filterer, sidebar }) => {
	const [input, setInput] = useState('');
	const types = Array.from(new Set(programs.flatMap((program) => program.types))).map((type) => ({
		value: type,
		label: type === 'co-op' ? 'Co-op' : toTitleCase(type?.replaceAll('-', ' ')),
		selected: true,
	}));
	const [selectedTypes, setSelectedTypes] = useState(types);

	const matching = useSearch(programs, input);
	const filtered = useMemo(
		() =>
			matching
				?.filter((program) => selectedTypes.some((type) => program.types.includes(type.value)))
				?.map((program) => (
					<UnstyledLink className="block" href={program.url} key={program.id}>
						{program.title}
					</UnstyledLink>
				)),
		[input, matching, selectedTypes],
	);

	return (
		<>
			<div className="flex flex-col gap-4 sm:grid sm:grid-cols-[75%_25%] sm:gap-6">
				<TextInput onInput={(value) => setInput(value)} label="What would you like to study?" />

				<Select
					multiple
					options={types}
					onChange={(options) => {
						setSelectedTypes(options);
					}}
					label="Filter by type"
				/>
			</div>

			<div className="flex flex-col justify-between">{children}</div>

			<div className="mt-5">{filtered}</div>
		</>
	);
};
