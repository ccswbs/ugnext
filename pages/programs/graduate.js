import React, { useState } from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';
import { ProgramNavigation } from '@/components/programs/navigation';
import { UnstyledLink } from '@/components/link';
import { Select } from '@/components/select';

export async function getStaticProps() {
	const path = join(process.cwd(), 'data', 'programs', 'graduate.yml');
	const programs = await readYamlFile(path);

	return {
		props: {
			programs: programs,
		},
	};
}

export default function ProgramsGraduate({ programs }) {
	const [filter, setFilter] = useState(null);

	return (
		<Layout title="Graduate Programs">
			<Container centered>
				<Heading level={1}>Graduate Programs at the University of Guelph</Heading>

				<ProgramNavigation />

				<ProgramSearch
					programs={programs}
					filterer={filter}
					render={(program) => (
						<UnstyledLink
							className="focus:visible:ring-offset-2 flex flex-col justify-center transition hover:scale-105 hover:bg-light-blue-100 focus:scale-105 focus:bg-light-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-light-blue"
							href={program.url}
							key={program.id + program.url}
						>
							<span className="bg-light-blue-50 p-5">{program.title}</span>
							<span className="bg-light-blue-100 px-5 py-2">{program?.degrees?.join(', ')}</span>
						</UnstyledLink>
					)}
				>
					<div className="sm:ml-auto sm:w-1/3 md:w-1/4">
						<Select
							label="Filter by degree type"
							multiple
							options={[
								{
									value: 'phd',
									label: 'PhD',
									selected: true,
								},
								{
									value: 'masters',
									label: 'Masters',
									selected: true,
								},
								{
									value: 'diploma',
									label: 'Graduate Diploma',
									selected: true,
								},
							]}
							onChange={(selected) => {
								if (selected.length === 3) {
									setFilter(null);
									return;
								}

								const predicates = [];

								for (const option of selected) {
									switch (option.value) {
										case 'phd':
											predicates.push((program) => program?.degrees?.includes('PhD'));
											break;
										case 'masters':
											predicates.push(
												(program) =>
													program?.degrees?.length > 1 ||
													(program?.degrees?.length === 1 &&
														!program?.degrees?.includes('PhD') &&
														!program?.degrees?.includes('GDip')),
											);
											break;
										case 'diploma':
											predicates.push((program) => program?.degrees?.includes('GDip'));
											break;
									}
								}

								setFilter(() => (program) => predicates.reduce((acc, cur) => cur(program) || acc, false));
							}}
						/>
					</div>
				</ProgramSearch>
			</Container>
		</Layout>
	);
}
