import { TextInput } from '@/components/text-input';
import { Select } from '@/components/select';
import { toTitleCase } from '@/lib/string-utils';
import { useSearch } from '@/lib/use-search';
import { useState } from 'react';

export const ProgramSearch = ({ programs, children, filterer, sidebar }) => {
	const [input, setInput] = useState('');
	const types = Array.from(new Set(programs.flatMap((program) => program.types)));
	const [type, setType] = useState('any');

	const filtered = useSearch(programs, input);

	return (
		<>
			<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
				<div className="flex-[2_1_auto]">
					<TextInput onInput={(value) => setInput(value)} label="What would you like to study?" />
				</div>

				<div className="flex-[1_1_auto]">
					<Select
						options={[
							{ value: 'any', label: 'Any', selected: true },
							...types?.map((type) => ({
								value: type,
								label: type === 'co-op' ? 'Co-op' : toTitleCase(type?.replaceAll('-', ' ')),
							})),
						]}
						onChange={(option) => {
							console.log(option?.value);
							setType(option?.value);
						}}
						label="Filter by type"
					/>
				</div>
			</div>

			<div className="flex flex-col justify-between">{children}</div>

			<div>
				{filtered
					.filter((program) => !(type !== 'any' && !program.types.includes(type)))
					.map((program) => (
						<a href={program.url} key={program.id}>
							{program.title}
						</a>
					))}
			</div>
		</>
	);
};
