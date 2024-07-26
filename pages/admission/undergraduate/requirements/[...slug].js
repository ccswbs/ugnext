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
import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftToBracket } from '@awesome.me/kit-7993323d0c/icons/sharp/solid';

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
				<Heading className="text-red" level={2} as="h1">
					{title || 'Undergraduate Admission Requirements'}
				</Heading>

				<Button className="flex gap-2 w-fit" color="red" href="/admission/undergraduate/requirements/">
					<FontAwesomeIcon icon={faArrowLeftToBracket} />
					<span>View Other Requirements</span>
				</Button>

				<HtmlParser html={content} />
			</Container>
		</Layout>
	);
}
