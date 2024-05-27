import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { GraduateProgramHero } from '@/components/programs/graduate/hero'
import { GraduateProgramNavigation } from '@/components/programs/graduate/navigation';
import { GraduateProgramSummary } from '@/components/programs/graduate/summary';
import { GraduateProgramInfo } from '@/components/programs/graduate/information';


export async function getStaticProps() {
	const path = join(process.cwd(), 'data', 'programs', 'graduate.yml');
	const programs = await readYamlFile(path);

	return {
		props: {
			programs: programs,
		},
	};
}

export default function ProgramGraduate() {
	return (
		<Layout title="Graduate Program">
			<GraduateProgramHero />
			<Container centered>
				<Heading level={1}>Biostatistics - Master of Science (MSc)</Heading>
				<GraduateProgramNavigation />

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
