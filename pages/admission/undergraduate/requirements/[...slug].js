import {
	getRequirementTitle,
	slugToRequirement,
	isValidRequirement,
	getRequirementContent,
} from '@/data/sqlite/admission/undergraduate/requirements';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { HtmlParser } from '@/components/html-parser';

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

export default function UndergraduateAdmissionRequirements({ title, content }) {
	return (
		<Layout title={title || 'Undergraduate Admission Requirements'}>
			<Container centered>
				<Heading level={1}>{title || 'Undergraduate Admission Requirements'}</Heading>

				<HtmlParser html={content} />
			</Container>
		</Layout>
	);
}
