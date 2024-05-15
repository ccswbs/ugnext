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

				<ProgramNavigation />

				<ProgramSearch
					programs={programs}
					render={(program) => (
						<UnstyledLink
							className="focus:visible:ring-offset-2 group flex flex-col justify-center transition hover:scale-105 focus:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-light-blue"
							href={program.url}
							key={program.id + program.url}
						>
							<span className="bg-light-blue-50 p-5 transition-colors group-hover:bg-light-blue-100">
								{program.title}
							</span>
							<span className="border-t border-t-blue-200 bg-light-blue-100 px-5 py-2 transition-colors">
								{program?.types?.map(type => toTitleCase(type)).join(', ')}
							</span>
						</UnstyledLink>
					)}
				/>
			</Container>
		</Layout>
	);
}
