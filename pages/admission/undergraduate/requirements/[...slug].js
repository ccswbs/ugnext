import { validateRequirementsSlug } from '@/data/sqlite/admission/undergraduate/requirements';

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const isValid = await validateRequirementsSlug(context.params.slug);

	if (!isValid) {
		return {
			notFound: true,
		};
	}

	return {
		props: {},
	};
}

export default function UndergraduateAdmissionRequirements(props) {}
