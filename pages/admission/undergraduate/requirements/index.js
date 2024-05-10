import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { Container } from '@/components/container';
import { readYamlFile } from '@/lib/file-utils';
import { join } from 'path';
import { hierarchy } from '@/lib/admission-requirements';
import { useEffect } from 'react';
import { Select } from '@/components/select';

export async function getStaticProps(context) {
	const path = join(process.cwd(), 'data/admission/undergraduate/requirements');

	const props = {};

	for (const attribute of hierarchy) {
		props[attribute] = await readYamlFile(join(path, `${attribute}.yml`));
	}

	return { props: props };
}

export default function AdmissionRequirementsHome(props) {
	useEffect(() => {
		console.log(props);
	}, []);

	return (
		<Layout>
			<Container centered>
				<Heading level={1}>Undergraduate Admission Requirements</Heading>

				<div className="flex w-2/3 flex-col gap-4">
					{Object.getOwnPropertyNames(props)
						.reverse()
						.map((key) => (
							<Select
								key={key}
								label={props[key]?.prompt}
								options={props[key]?.values?.map(({ id, name }) => ({
									value: id,
									label: name,
								}))}
							/>
						))}
				</div>
			</Container>
		</Layout>
	);
}
