import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { ButtonNavigation } from '@/components/programs/graduate/navigation-buttons';
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';

export async function getStaticProps() {
	const path = join(process.cwd(), 'data', 'programs', 'graduate','biostatistics.yml');
	const program = await readYamlFile(path);

	return {
		props: {
			program: program,
		},
	};
}

/*
@TODO: Send links for button navigation
*/

export default function ProgramGraduate({program}) {
	return (
		<Layout title="Graduate Program">
			<GraduateProgramHero />

			<Container centered>
				<Heading level={1}> {program.title} | Master of Science - Course-based (MSc)</Heading>
				<ButtonNavigation label="Program Navigation" />

				<div className="pt-1 grid xl:grid-cols-12 xl:gap-x-10">
					<div className='xl:col-span-9'>
						<GraduateProgramInfo />
					</div>
					
					
					<div className='xl:col-span-3'>
						<GraduateProgramSummary />
					</div>
				</div>

			</Container>
		</Layout>
	);
}
