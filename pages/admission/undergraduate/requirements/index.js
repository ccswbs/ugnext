import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { getAllLocations, getAllPrograms, getAllStudentTypes } from '@/data/yaml/admission/undergraduate/requirements';
import { Select } from '@/components/select';
import { Heading } from '@/components/heading';
import { useMemo, useState } from 'react';
import { Button } from '@/components/button';
import { useRouter } from 'next/router';

export async function getStaticProps(context) {
	return {
		props: {
			locations: await getAllLocations(),
			studentTypes: await getAllStudentTypes(),
			programs: (await getAllPrograms()) ?? [],
		},
	};
}

const requirementToSlug = (studentType, program, location) => {
	let slug = `${studentType}`;

	if (program) {
		slug += `/${program}`;
	}

	if (location) {
		slug += `/${location}`;
	}

	return slug;
};

export default function UndergraduateAdmissionRequirementsHome({ locations, studentTypes, programs }) {
	const [studentType, setStudentType] = useState(null);
	const [location, setLocation] = useState(null);
	const [program, setProgram] = useState(null);

	const [showInternational, setShowInternational] = useState(false);
	const [showCurriculums, setShowCurriculums] = useState(false);

	const isLocationRequirementMet = (studentType?.isLocationDependent && location) || !studentType?.isLocationDependent;
	const isProgramRequirementMet = (studentType?.isProgramDependent && program) || !studentType?.isProgramDependent;
	const isComplete = studentType && isLocationRequirementMet && isProgramRequirementMet;

	const locationDependentStudentTypes = useMemo(
		() => new Set(studentTypes.filter((type) => type.isLocationDependent).map((type) => type.id)),
		[studentTypes],
	);

	const programDependentStudentTypes = useMemo(
		() => new Set(studentTypes.filter((type) => type.isProgramDependent).map((type) => type.id)),
		[studentTypes],
	);

	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!isComplete) return;

		const slug = requirementToSlug(
			studentType.id,
			studentType.isProgramDependent ? program.id : null,
			studentType.isLocationDependent ? location.id : null,
		);

		router.push(`/admission/undergraduate/requirements/${slug}`).catch((e) => console.error(e));
	};

	return (
		<Layout title="Undergraduate Admission Requirements">
			<Container centered>
				<Heading level={1}>Undergraduate Admission Requirements</Heading>

				<form className="flex flex-col gap-8 max-w-screen-md" onSubmit={handleSubmit}>
					<Select
						label={
							<Heading level={5} as="h2" className="mb-1 mt-0">
								I am a
							</Heading>
						}
						options={studentTypes.map((type) => ({
							label: type.name,
							value: type,
							key: type.id,
						}))}
						onChange={(selection) => {
							setStudentType(selection?.value);

							if (!selection) {
								setLocation(null);
								setProgram(null);
							}
						}}
					/>

					{locationDependentStudentTypes.has(studentType?.id) && (
						<>
							<Select
								label={
									<Heading level={5} as="h2" className="mb-1 mt-0">
										I attend/attended high school in
									</Heading>
								}
								options={[
									...locations.domestic.map((location) => ({
										label: location.name,
										value: location,
										key: location.id,
									})),
									{
										label: 'Outside of Canada',
										value: 'international',
										key: 'international',
									},
									{
										label: 'Another Curriculum of Study',
										value: 'curriculum',
										key: 'curriculum',
									},
								]}
								onChange={(selection) => {
									switch (selection?.value) {
										case 'international':
											setShowInternational(true);
											setShowCurriculums(false);
											setLocation(null);
											break;
										case 'curriculum':
											setShowInternational(false);
											setShowCurriculums(true);
											setLocation(null);
											break;
										default:
											setShowInternational(false);
											setShowCurriculums(false);
											setLocation(selection?.value);
									}
								}}
							/>

							{showInternational && (
								<Select
									autocomplete
									label={
										<Heading level={5} as="h2" className="mb-1 mt-0">
											I study/studied in
										</Heading>
									}
									options={locations.international.map((location) => ({
										label: location.name,
										value: location,
										key: location.id,
									}))}
									onChange={(selection) => {
										setLocation(selection?.value);
									}}
								/>
							)}

							{showCurriculums && (
								<Select
									label={
										<Heading level={5} as="h2" className="mb-1 mt-0">
											My curriculum of study is/was
										</Heading>
									}
									options={locations.curriculum.map((location) => ({
										label: location.name,
										value: location,
										key: location.id,
									}))}
									onChange={(selection) => {
										setLocation(selection?.value);
									}}
								/>
							)}
						</>
					)}

					{programDependentStudentTypes.has(studentType?.id) && (
						<Select
							autocomplete
							label={
								<Heading level={5} as="h2" className="mb-1 mt-0">
									I am interested in studying
								</Heading>
							}
							options={programs?.map((program) => ({
								label: program.name,
								value: program,
								key: program.id,
							}))}
							onChange={(selection) => {
								setProgram(selection?.value);
							}}
						/>
					)}
					<Button className="w-full sm:w-fit" color="red" type="submit" disabled={!isComplete} outlined={!isComplete}>
						View Requirements
					</Button>
				</form>
			</Container>
		</Layout>
	);
}
