import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import Image from 'next/image';
import { List, ListItem } from '@/components/list';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';


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
				<div className="relative flex w-full flex-col overflow-hidden">
					<Image
						className={'aspect-[16/9] max-h-[80vh] w-full object-cover md:aspect-[2.625]'}
						src={"https://rm-nextjs-chug.pantheonsite.io/sites/default/files/2024-03/students-in-front-of-library.jpg"}
						alt={"Test image"}
						width={1680}
						height={640}
						priority
						sizes="100vw"
					/>
			</div>
			<Container centered>
				<div className="pt-1">
					<Heading level={1}>Master of Science (Thesis-based): MSc</Heading>
					<p className="text-lg">Biostatics is a research oriented department with dynamic hands on educational programs for both undergraduates and graduate students. Research and teaching programs in MBST revolve around the basic sciences relevant to animal development and wellbeing. Our department receives $6-7million in research funding each year, which is used in part to support approximately 130 graduate students at any one time enrolled in MSc and PhD programs. Our graduate student population represents over 20 different countries, which reflects our many international connections and collaborations.</p>

					<Heading level={2}>Program Information</Heading>

					<Heading level={2}>Research Fields</Heading>

					<List variant="unordered">
						<ListItem>Theriogenology</ListItem>
						<ListItem>Clinical Epidemiology</ListItem>
					</List>

				</div>

			</Container>

		</Layout>
	);
}
