import { graphql } from '@/lib/drupal';

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	};
}

export async function getStaticProps(context) {
	const { data, errors } = await graphql(
		`
			query ($url: String!) {
				route(path: $url) {
					... on RouteInternal {
						entity {
							__typename
						}
					}
				}
			}
		`,
		{
			url: '/node/' + context.params.slug.join('/'),
		},
	);

	console.log('/node/' + context.params.slug.join('/'));

	if (errors) {
		throw new Error(errors);
	}

	// Redirect the preview of Spotlight to the home page
	if (data.route?.entity?.__typename === 'NodeSpotlight') {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		};
	}

	return {
		notFound: true,
	};
}

export default function Node() {
	return '';
}
