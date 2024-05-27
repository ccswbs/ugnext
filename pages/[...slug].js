import { useRouter } from 'next/router';
import { graphql } from '@/lib/drupal';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';

export async function getStaticPaths() {
	let paths = [];

	return {
		paths: paths,
		fallback: 'blocking',
	};
}

export async function getStaticProps(context) {
	// Try to get the ID of the page the user is requesting.
	const id = (
		await graphql(
			`
				query GetPage($url: String!) {
					route(path: $url) {
						... on RouteInternal {
							entity {
								... on NodePage {
									id
								}
							}
						}
					}
				}
			`,
			{
				url: '/' + context.params.slug.join('/'),
			},
		)
	)?.data?.route?.entity?.id;

	// If we couldn't resolve an id, then that means this page doesn't exist on content hub, show a 404.
	if (!id) {
		return {
			notFound: true,
		};
	}

	return {
		props: { data: {} },
	};
}

export default function Page({ data }) {
	return (
		<Layout>
			<Container centered>
				<Heading level={1}>{data?.title}</Heading>
			</Container>
		</Layout>
	);
}
