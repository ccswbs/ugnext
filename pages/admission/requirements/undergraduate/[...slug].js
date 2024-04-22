import { promises as fs } from 'fs';
import YAML from 'yaml';
import Layout from '@/components/layout';
import { hierarchy, Requirement } from '@/lib/admission-requirements';
import HtmlParser from '@/components/html-parser';

export async function getStaticPaths() {
	// For admission pages we don't want to prerender any pages, we will always generate them on demand.
	return {
		paths: [],
		fallback: 'blocking',
	};
}

export async function getStaticProps(context) {
	// We want to check that the slug matches the possible values we have defined
	const slug = context?.params?.slug ?? [];
	const length = Math.min(hierarchy.length, slug.length);
	let valid = false;

	for (let i = 0; i < length; i++) {
		const key = hierarchy[hierarchy.length - 1 - i];
		const toFind = slug[i];

		try {
			const path = process.cwd() + `/data/admission/undergraduate/admission-requirements-${key}.yml`;
			const data = YAML.parse(await fs.readFile(path, 'utf8'));

			if (!data.some((value) => value?.id === toFind)) {
				break;
			}
		} catch (e) {
			break;
		}

		// If we are on the last iteration that means we successfully validated the slug.
		if (i === length - 1) {
			valid = true;
		}
	}

	if (!valid) {
		return { notFound: true };
	}

	// Now that we validated the slug we get the content for the page.
	const toFind = Requirement.parse(slug);

	if (!toFind) {
		return { notFound: true };
	}

	const data = await fs.readFile(process.cwd() + '/data/admission/undergraduate/admission-requirements.yml', 'utf8');
	const requirements = YAML.parse(data).map((el) => new Requirement(el));

	// Find the closest requirement as a fallback in case the one the user is looking for isn't defined
	const match = Requirement.findClosest(
		toFind,
		requirements,
	);

	if (!match) {
		return { notFound: true };
	}

	return {
		props: {
			content: match.data.content ?? '',
			revalidate: 10, // Revalidate at most, every 10 seconds
		},
	};
}

export default function AdmissionRequirementsPage({ content }) {
	return (
		<Layout>
			<div className="flex flex-col prose text-base">
				<HtmlParser html={content} />
			</div>
		</Layout>
	);
}
