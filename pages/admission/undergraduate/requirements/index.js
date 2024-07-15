import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { getLocations, getPrograms, getStudentTypes } from '@/data/sqlite/admission/undergraduate/requirements';
import { Select } from '@/components/select';
import { Heading } from '@/components/heading';
import { useState } from 'react';
import { Button } from '@/components/button';

export async function getStaticProps(context) {
	return {
		props: {
			locations: await getLocations(),
			studentTypes: await getStudentTypes(),
			programs: (await getPrograms()) ?? [],
		},
	};
}

export default function UndergraduateAdmissionRequirementsHome({ locations, studentTypes, programs }) {
	const [requirement, setRequirement] = useState({
		studentType: null,
		location: null,
	});

	const [international, setInternational] = useState(false);
	const [systemOfStudy, setSystemOfStudy] = useState(false);

	const complete = requirement.studentType && requirement.location && requirement.program;

	console.log(requirement);

	return (
		<Layout title="Undergraduate Admission Requirements">
			<Container centered>
				<Heading level={1}>Undergraduate Admission Requirements</Heading>

				<form className="flex flex-col gap-8">
					<Select
						label={
							<Heading level={5} as="h2" className="mb-1 mt-0">
								I am a
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
							...locations.provinces.map((location) => ({
								label: location.name,
								value: location.name,
							})),
							{
								label: 'Outside of Canada in Another Country',
								value: 'international',
							},
							{
								label: 'Outside of Canada Based on a System Of Study',
								value: 'system-of-study',
							},
						]}
						onChange={(selection) => {
							switch (selection.value) {
								case 'international':
									setInternational(true);
									setSystemOfStudy(false);
									setRequirement({ ...requirement, location: null });
									break;
								case 'system-of-study':
									setInternational(false);
									setSystemOfStudy(true);
									setRequirement({ ...requirement, location: null });
									break;
								default:
									setInternational(false);
									setSystemOfStudy(false);
									setRequirement({ ...requirement, location: selection.value });
							}
						}}
					/>

					{international && (
						<Select
							label={
								<Heading level={5} as="h2" className="mb-1 mt-0">
									My country is/was
								</Heading>
							}
							options={locations.countries.map((location) => ({
								label: location.name,
								value: location.name,
							}))}
							onChange={(selection) => {
								setRequirement({ ...requirement, location: selection.value });
							}}
						/>
					)}

					{systemOfStudy && (
						<Select
							label={
								<Heading level={5} as="h2" className="mb-1 mt-0">
									My system of study was
								</Heading>
							}
							options={locations.systemsOfStudy.map((location) => ({
								label: location.name,
								value: location.name,
							}))}
							onChange={(selection) => {
								setRequirement({ ...requirement, location: selection.value });
							}}
						/>
					)}

					<Select
						label={
							<Heading level={5} as="h2" className="mb-1 mt-0">
								I am interested in studying
							</Heading>
						}
						options={programs?.map((program) => ({
							label: program.title,
							value: program.title,
							key: program.title,
						}))}
						onChange={(selection) => {
							setRequirement({ ...requirement, program: selection.value });
						}}
					/>
					<Button color="red" type="submit" disabled={!complete} outlined={!complete}>
						View Requirements
					</Button>
				</form>
			</Container>
		</Layout>
	);
}
