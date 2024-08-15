import {
	getRequirementTitle,
	slugToRequirement,
	getRequirementContent,
} from '@/data/yaml/admission/undergraduate/requirements';
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

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const requirement = await slugToRequirement(context.params.slug);

	if (!requirement) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			title: getRequirementTitle(requirement),
			content: await getRequirementContent(requirement),
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

							<div className="flex flex-col [&_p]:py-2 py-6">
								<HtmlParser html={content.body ?? ''} />
							</div>
						</>
					}
					secondary={
						content.links.length > 0 && (
							<div className="flex flex-col pl-8 mt-5">
								<Heading level={3} as="h2" className="mb-1">
									More Information
								</Heading>
								<List className="text-lg">
									{content.links.map((link) => (
										<ListItem key={link.title}>
											<Link className="block pt-0 w-fit" href={link.url}>
												{link.title}
											</Link>
										</ListItem>
									))}
								</List>
							</div>
						)
					}
				/>
			</Container>
		</Layout>
	);
}
