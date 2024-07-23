import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { getLocations, getPrograms, getStudentTypes } from '@/data/sqlite/admission/undergraduate/requirements';
import { Select } from '@/components/select';
import { Heading } from '@/components/heading';
import { useMemo, useState } from 'react';
import { Button } from '@/components/button';
import { Section } from '@/components/section';
import { List, ListItem } from '@/components/list';
import { Link } from '@/components/link';
import { useRouter } from 'next/router';
import { slugify } from '@/lib/string-utils';

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
	const [studentType, setStudentType] = useState(null);
	const [location, setLocation] = useState(null);
	const [program, setProgram] = useState(null);

	const [showInternational, setShowInternational] = useState(false);
	const [showCurriculums, setShowCurriculums] = useState(false);

	const isLocationRequirementMet = (studentType?.location_dependent && location) || !studentType?.location_dependent;
	const isProgramRequirementMet = (studentType?.program_dependent && program) || !studentType?.program_dependent;
	const isComplete = studentType && isLocationRequirementMet && isProgramRequirementMet;

	const locationDependentStudentTypes = useMemo(
		() => new Set(studentTypes.filter((type) => type.location_dependent).map((type) => type.id)),
		[studentTypes],
	);

	const programDependentStudentTypes = useMemo(
		() => new Set(studentTypes.filter((type) => type.program_dependent).map((type) => type.id)),
		[studentTypes],
	);

	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!isComplete) return;

		let slug = `${studentType.id}`;

		if (studentType.program_dependent) {
			slug += `/${slugify(program.title)}`;
		}

		if (studentType.location_dependent) {
			slug += `/${slugify(location.name)}`;
		}

		router.push(`/admission/undergraduate/requirements/${slug}`).catch((e) => console.error(e));
	};

	return (
		<Layout title="Undergraduate Admission Requirements">
			<Container centered>
				<Section
					primary={
						<>
							<Heading level={1}>Undergraduate Admission Requirements</Heading>

							<form className="flex flex-col gap-8" onSubmit={handleSubmit}>
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

										if(!selection) {
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
													key: location.name,
												})),
												{
													label: 'Outside of Canada',
													value: 'international',
													key: 'international',
												},
												{
													label: 'Other Curriculum',
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
													key: location.name,
												}))}
												onChange={(selection) => {
													setLocation(selection?.value);
												}}
											/>
										)}

										{showCurriculums && (
											<Select
												autocomplete
												label={
													<Heading level={5} as="h2" className="mb-1 mt-0">
														My curriculum of study is/was
													</Heading>
												}
												options={locations.curriculums.map((location) => ({
													label: location.name,
													value: location,
													key: location.name,
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
											label: program.title,
											value: program,
											key: program.title,
										}))}
										onChange={(selection) => {
											setProgram(selection?.value);
										}}
									/>
								)}
								<Button
									className="w-full sm:w-fit"
									color="red"
									type="submit"
									disabled={!isComplete}
									outlined={!isComplete}
								>
									View Requirements
								</Button>
							</form>
						</>
					}
					secondary={
						<div className="flex flex-col pl-8">
							<Heading level={3} as="h2" className="mb-1">
								More Information
							</Heading>
							<List className="text-lg">
								<ListItem>
									<Link className="block pt-0 w-fit" href="https://www.uoguelph.ca/apply/">
										How to apply
									</Link>
								</ListItem>
								<ListItem>
									<Link className="block pt-0 w-fit" href="/programs/undergraduate">
										Search for a program
									</Link>
								</ListItem>
								<ListItem>
									<Link
										className="block pt-0 w-fit"
										href="https://admission.uoguelph.ca/2c042408-ce57-40b8-9689-192f685e8909"
									>
										English Proficiency Requirements
									</Link>
								</ListItem>
							</List>
						</div>
					}
				/>
			</Container>
		</Layout>
	);
}
