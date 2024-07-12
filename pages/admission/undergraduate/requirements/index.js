import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { getLocations, getStudentTypes } from '@/data/yaml/admission-requirements';
import { Select } from '@/components/select';
import { Heading } from '@/components/heading';
import { useState } from 'react';

export async function getStaticProps(context) {
	return {
		props: {
			locations: getLocations(),
			studentTypes: getStudentTypes(),
		},
	};
}

export default function UndergraduateAdmissionRequirementsHome({ locations, studentTypes }) {
	const [requirement, setRequirement] = useState({
		studentType: null,
		location: null,
		degree: null,
	});

	const [international, setInternational] = useState(false);

	console.log(requirement);

	return (
		<Layout title="Undergraduate Admission Requirements">
			<Container centered>
				<Heading level={1}>Undergraduate Admission Requirements</Heading>

				<form className="flex flex-col gap-8">
					<Select
						label={
							<Heading level={5} as="h2" className="mb-1 mt-0">
								I am a(n)
							</Heading>
						}
						options={studentTypes.map((type) => ({
							label: type.name,
							value: type.id,
						}))}
						onChange={(selection) => {
							setRequirement({ ...requirement, studentType: selection.value });
						}}
					/>

					<Select
						label={
							<Heading level={5} as="h2" className="mb-1 mt-0">
								I attend/attended high school in
							</Heading>
						}
						options={[
							...locations.canada.map((type) => ({
								label: type.name,
								value: type.id,
							})),
							{
								label: 'Outside of Canada',
								value: 'international',
							},
						]}
						onChange={(selection) => {
							if (selection.value === 'international') {
								setInternational(true);
								setRequirement({ ...requirement, location: null });
							} else {
								setInternational(false);
								setRequirement({ ...requirement, location: selection.value });
							}
						}}
					/>

					{international && (
						<Select
							label={
								<Heading level={5} as="h2" className="mb-1 mt-0">
									Country/System of study:
								</Heading>
							}
							options={locations.international.map((type) => ({
								label: type.name,
								value: type.id,
							}))}
							onChange={(selection) => {
								setRequirement({ ...requirement, location: selection.value });
							}}
						/>
					)}
				</form>
			</Container>
		</Layout>
	);
}
