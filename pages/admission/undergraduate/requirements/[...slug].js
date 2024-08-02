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
import { Section } from '@/components/section';
import { List, ListItem } from '@/components/list';
import { Link } from '@/components/link';
import { Sidebar } from '@/components/admission/undergraduate/requirements/sidebar';

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
				<Section
					primary={
						<>
							<Heading level={1}>{title || 'Undergraduate Admission Requirements'}</Heading>

							<Button className="flex gap-2 w-fit" color="red" href="/admission/undergraduate/requirements/">
								<FontAwesomeIcon icon={faArrowLeftToBracket} />
								<span>View Other Requirements</span>
							</Button>

							<div className="flex flex-col gap-3 py-6">
								<HtmlParser html={content ?? ''} />
							</div>
						</>
					}
					secondary={<Sidebar />}
				/>
			</Container>
		</Layout>
	);
}
