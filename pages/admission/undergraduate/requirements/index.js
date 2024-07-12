import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { getLocations, getStudentTypes } from '@/data/yaml/admission-requirements';
import { Select } from '@/components/select';
import { Heading } from '@/components/heading';

export async function getStaticProps(context) {
	return {
		props: {
			locations: getLocations(),
			studentTypes: getStudentTypes(),
		},
	};
}

export default function UndergraduateAdmissionRequirementsHome({ locations, studentTypes }) {
	return (
		<Layout title="Undergraduate Admission Requirements">
			<Container centered>
				<Heading level={1}>Undergraduate Admission Requirements</Heading>
				<Select
					label={
						<Heading level={5} as="h2" className="mb-1 mt-0">
							I am a(n).
						</Heading>
					}
					options={studentTypes.map((type) => {
						return {
							label: type.name,
							value: type.id,
						};
					})}
				/>
			</Container>
		</Layout>
	);
}
