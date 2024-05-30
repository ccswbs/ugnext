import React from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';
import { ProgramNavigation } from '@/components/programs/navigation';
import { UnstyledLink } from '@/components/link';
import { toTitleCase } from '@/lib/string-utils';
import { Card } from '@/components/card';

export async function getStaticProps() {
	const path = join(process.cwd(), 'data', 'programs', 'undergraduate.yml');
	const programs = await readYamlFile(path);

	return {
		props: {
			programs: programs,
		},
	};
}

export default function ProgramsUndergraduate({ programs }) {
	return (
		<Layout title="Undergraduate Programs">
			<Container centered>
				<Heading level={1}>Undergraduate Programs at the University of Guelph</Heading>

				<ProgramSearch
					programs={programs}
					render={(program) => (
						<Card
							href={program.url}
							key={program.id + program.url}
							title={<span className="flex items-center">{program.title}</span>}
							footer={program?.types?.map((type) => toTitleCase(type)).join(', ')}
						/>
					)}
				/>
			</Container>
		</Layout>
	);
}
