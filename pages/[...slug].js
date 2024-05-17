import { useRouter } from 'next/router';
import { graphql } from '@/lib/drupal';

export async function getStaticPaths() {
	let paths = [];
	let cursor = '';
	let hasNextPage = true;

	while (hasNextPage) {
		const { data } = await graphql(
			`
				query GetPages($cursor: Cursor) {
					nodePages(first: 100, after: $cursor) {
						edges {
							node {
								path
							}
						}
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			`,
			{
				cursor: cursor,
			},
		);

		cursor = data?.nodePages?.pageInfo?.endCursor ?? '';
		hasNextPage = data?.nodePages?.pageInfo?.hasNextPage ?? false;
		paths = paths.concat(
			data?.nodePages?.edges?.map(({ node }) => {
				return {
					params: {
						slug: node.path?.split('/').filter(Boolean),
					},
				};
			}),
		);
	}

	return {
		paths: paths,
		fallback: false,
	};
}

export async function getStaticProps(context) {
	const { data, errors } = await graphql(
		`
			query GetPage($url: String!) {
				route(path: $url) {
					... on RouteInternal {
						entity {
							... on NodePage {
								title
							}
						}
					}
				}
			}
		`,
		{
			url: '/' + context.params.slug.join('/'),
		},
	);

	if (errors) {
		throw new Error(errors);
	}

	return {
		props: { data: data.route.entity },
	};
}

export default function Page({ data }) {
	const router = useRouter();

	return <p>Post: {JSON.stringify(data)}</p>;
}
