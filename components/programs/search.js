import { TextInput } from '@/components/text-input';
import { Select } from '@/components/select';
import { toTitleCase } from '@/lib/string-utils';
import { useSearch } from '@/lib/use-search';
import { useMemo, useState } from 'react';
import { UnstyledLink } from '@/components/link';

export const ProgramSearch = ({ programs, children, filterer }) => {
	const [input, setInput] = useState('');
	const types = useMemo(
		() =>
			Array.from(new Set(programs.flatMap((program) => program.types))).map((type) => ({
				value: type,
				label: type === 'co-op' ? 'Co-op' : toTitleCase(type?.replaceAll('-', ' ')),
				selected: true,
			})),
		[programs],
	);
	const [selectedTypes, setSelectedTypes] = useState(types);

	const matching = useSearch(programs, input);
	const filtered = useMemo(
		() =>
			matching
				?.filter((program) => selectedTypes.some((type) => program.types.includes(type.value)))
				?.filter((program) => (typeof filterer === 'function' ? filterer(program) : () => true))
				?.map((program) => (
					<UnstyledLink
						className="focus:visible:ring-offset-2 flex items-center bg-light-blue-50 p-5 transition hover:scale-105 hover:bg-light-blue-100 focus:scale-105 focus:bg-light-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-light-blue"
						href={program.url}
						key={program.id}
					>
						{program.title}
					</UnstyledLink>
				)),
		[filterer, matching, selectedTypes],
	);

	return (
		<>
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="flex-1">
						<TextInput onInput={(value) => setInput(value)} label="What would you like to study?" />
					</div>

					<div className="sm:w-1/3 md:w-1/4">
						<Select
							multiple
							options={types}
							onChange={(options) => {
								setSelectedTypes(options);
							}}
							label="Filter by type"
						/>
					</div>
				</div>

				<div className="flex flex-col justify-between">{children}</div>
			</div>
			<div className="mt-5 grid grid-cols-[repeat(auto-fit,_minmax(30rem,_1fr))] gap-5">{filtered}</div>
		</>
	);
};
