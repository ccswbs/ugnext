import React from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';
import { ProgramNavigation } from '@/components/programs/navigation';
import { Radio } from '@/components/radio';

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
	return (
		<Layout title="Graduate Programs">
			<Container centered>
				<Heading level={1}>Graduate Programs at the University of Guelph</Heading>

				<ProgramNavigation />

				<ProgramSearch programs={programs}>
					<div className="ml-auto sm:w-1/3 md:w-1/4">
						<Radio
							label="Filter by PhD or Masters"
							inline
							options={[
								{
									value: 'phd',
									label: 'PhD',
								},
								{
									value: 'masters',
									label: 'Masters',
								},
								{
									value: 'both',
									label: 'Both',
									selected: true,
								},
							]}
						/>
					</div>
				</ProgramSearch>
			</Container>
		</Layout>
	);
}
