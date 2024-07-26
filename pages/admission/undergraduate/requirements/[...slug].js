import {
	getRequirementTitle,
	slugToRequirement,
	isValidRequirement,
	getRequirementContent,
} from '@/data/sqlite/admission/undergraduate/requirements';

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const { studentType, program, location } = slugToRequirement(context.params.slug);

	if (!(await isValidRequirement(studentType, program, location))) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			title: await getRequirementTitle(studentType, program, location),
			content: await getRequirementContent(studentType, program, location),
		},
	};
}

export default function UndergraduateAdmissionRequirements(props) {}
