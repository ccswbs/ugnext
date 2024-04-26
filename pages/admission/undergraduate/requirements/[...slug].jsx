import { promises as fs } from 'fs';
import YAML from 'yaml';
import Layout from '@/components/layout';
import { hierarchy, Requirement } from '@/lib/admission-requirements';
import HtmlParser from '@/components/html-parser';
import Container from '@/components/container';

export async function getStaticPaths() {
	// For admission pages we don't want to prerender any pages, we will always generate them on demand.
	return {
		paths: [],
		fallback: 'blocking',
	};
}

export async function getStaticProps(context) {
	const toFind = Requirement.parse(context?.params?.slug);

	if (!toFind) {
		return { notFound: true };
	}

	const data = await fs.readFile(process.cwd() + '/data/admission/undergraduate/requirements/admission-requirements.yml', 'utf8');
	const requirements = YAML.parse(data);

	const match = Requirement.findClosest(
		toFind,
		requirements.map((el) => new Requirement(el)),
	);

	if (!match) {
		return { notFound: true };
	}

	return {
		props: {
			content: match?.content ?? '',
			revalidate: 10, // Revalidate at most, every 10 seconds
		},
	};
}

export default function AdmissionRequirementsPage({ content }) {
	return (
		<Layout>
			<Container centered>
				<HtmlParser html={content} />
			</Container>
		</Layout>
	);
}
