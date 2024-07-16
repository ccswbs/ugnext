import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { getLocations, getPrograms, getStudentTypes } from '@/data/sqlite/admission/undergraduate/requirements';
import { Select } from '@/components/select';
import { Heading } from '@/components/heading';
import { useState } from 'react';
import { Button } from '@/components/button';
import { Section } from '@/components/section';
import { List, ListItem } from '@/components/list';
import { Link } from '@/components/link';

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
	const [showCountries, setShowCountries] = useState(false);
	const [showCurriculums, setShowCurriculums] = useState(false);
	const complete = (studentType && location && program) || (studentType === 'internal' && program);

	console.log(studentType);

	return (
		<Layout title="Undergraduate Admission Requirements">
			<Container centered>
				<Section
					primary={
						<>
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
										setStudentType(selection.value);
									}}
								/>
								{studentType !== 'internal' && (
									<>
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
													label: 'Outside of Canada',
													value: 'international',
												},
												{
													label: 'Other Curriculum',
													value: 'system-of-study',
												},
											]}
											onChange={(selection) => {
												switch (selection.value) {
													case 'international':
														setShowCountries(true);
														setShowCurriculums(false);
														setLocation(null);
														break;
													case 'system-of-study':
														setShowCountries(false);
														setShowCurriculums(true);
														setLocation(null);
														break;
													default:
														setShowCountries(false);
														setShowCurriculums(false);
														setLocation(selection.value);
												}
											}}
										/>

										{showCountries && (
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
													setLocation(selection.value);
												}}
											/>
										)}

										{showCurriculums && (
											<Select
												label={
													<Heading level={5} as="h2" className="mb-1 mt-0">
														My curriculum is/was
													</Heading>
												}
												options={locations.curriculums.map((location) => ({
													label: location.name,
													value: location.name,
												}))}
												onChange={(selection) => {
													setLocation(selection.value);
												}}
											/>
										)}
									</>
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
										setProgram(selection.value);
									}}
								/>
								<Button className="w-full sm:w-fit" color="red" type="submit" disabled={!complete} outlined={!complete}>
									View Requirements
								</Button>
							</form>
						</>
					}
					secondary={
						<div className="flex flex-col px-6">
							<Heading level={3} as="h2" className="">
								More Information
							</Heading>
							<Button variant="outlined" color="blue" href="https://www.uoguelph.ca/apply/">
								Apply Now
							</Button>
						</div>
					}
				/>
			</Container>
		</Layout>
	);
}
