import React from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';
import { ProgramNavigation } from '@/components/programs/navigation';

export async function getStaticProps() {
	const path = join(process.cwd(), 'data', 'programs', 'certificate-and-diploma.yml');
	const programs = await readYamlFile(path);

	return {
		props: {
			programs: programs,
		},
	};
}

export default function ProgramsCertificateAndDiploma({ programs }) {
	return (
		<Layout title="Certificate and Diplomas">
			<Container centered>
				<Heading level={1}>Certificate and Diplomas at the University of Guelph</Heading>

				<ProgramNavigation />

				<ProgramSearch programs={programs} />
			</Container>
		</Layout>
	);
}
