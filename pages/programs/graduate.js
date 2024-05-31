import React, { useState } from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';
import { Select } from '@/components/select';
import { Card } from '@/components/card';

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

				<ProgramSearch
					programs={programs}
					filterer={filter}
					render={(program) => (
						<Card
							href={program.url}
							key={program.id + program.url}
							title={
								<div className="flex flex-col justify-center text-lg">
									<span className="font-bold">{program.title}</span>
								</div>
							}
							footer={program?.degrees?.join(', ')}
						/>
					)}
				>
					<div className="sm:ml-auto sm:w-1/3 md:w-1/4">
						<Select
							label="Filter by degree type"
							multiple
							options={[
								{
									value: 'masters',
									label: 'Masters',
									selected: true,
								},
								{
									value: 'doctor',
									label: 'Doctoral/PhD',
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
										case 'doctor':
											predicates.push(
												(program) =>
													program?.degrees?.includes('PhD') || program.degrees.some((degree) => degree.startsWith('D')),
											);
											break;
										case 'masters':
											predicates.push((program) => program.degrees.some((degree) => degree.startsWith('M')));
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
