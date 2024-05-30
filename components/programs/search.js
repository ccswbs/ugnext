import { TextInput } from '@/components/text-input';
import { Select } from '@/components/select';
import { toTitleCase } from '@/lib/string-utils';
import { useSearch } from '@/lib/use-search';
import React, { useMemo, useState } from 'react';
import { UnstyledLink } from '@/components/link';
import { ProgramNavigation } from '@/components/programs/navigation';
import { Card } from '@/components/card';

export const ProgramSearch = ({ programs, children, filterer, render }) => {
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

	const results = useSearch(programs, input);
	const filtered = useMemo(() => {
		let filtered = results?.filter((program) => selectedTypes.some((type) => program.types.includes(type.value)));

		if (typeof filterer === 'function') {
			filtered = filtered?.filter((program) => filterer(program));
		}

		return filtered?.map(
			typeof render === 'function'
				? render
				: (program) => (
						<Card
							href={program.url}
							title={<span className="flex items-center text-lg font-bold">{program.title}</span>}
							footer={
								<span className="overflow-hidden text-ellipsis whitespace-nowrap">
									{program?.types?.map((type) => toTitleCase(type)).join(', ')}
								</span>
							}
						/>
					),
		);
	}, [filterer, render, results, selectedTypes]);

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

					{children}
				</div>

				<ProgramNavigation />

				<div className="flex flex-col justify-between"></div>
			</div>
			<div className="mt-5 grid grid-cols-[repeat(auto-fit,_minmax(30rem,_1fr))] gap-5">{filtered}</div>
		</>
	);
};
