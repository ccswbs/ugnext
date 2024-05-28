import { useRouter } from 'next/router';
import { graphql } from '@/lib/drupal';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { twJoin } from 'tailwind-merge';

export async function getStaticPaths() {
	// Here we can decide which pages get pre-rendered.
	let paths = [];
	let page = 0;
	let pageSize = 100;
	let hasNextPage = true;

	while (hasNextPage) {
		const results = (
			await graphql(
				`
					query GetPages($page: Int = 0, $pageSize: Int = 100) {
						content(filter: { type: "page", status: true }, page: $page, pageSize: $pageSize) {
							results {
								... on NodePage {
									path
								}
							}
						}
					}
				`,
				{
					page: page,
					pageSize: pageSize,
				},
			)
		)?.data?.content?.results;

		results?.length === pageSize ? page++ : (hasNextPage = false);
		paths = [...paths, ...results];
	}

	return {
		paths: paths.map((node) => ({
			params: {
				slug: node?.path?.split('/').filter(Boolean),
			},
		})),
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const isPreview = context?.preview || process.env.NODE_ENV !== 'production';
	const status = isPreview ? null : true;

	// Try to get the ID of the page the user is requesting.
	const id = (
		await graphql(
			`
				query GetPageID($url: String!) {
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

	// Now that we have the ID for the page we can request its content from its latest revision.
	const page = (
		await graphql(
			`
				query GetPage($id: String = "", $status: Boolean = false) {
					contentRevisions(filter: { id: $id, status: $status, type: "page" }, pageSize: 1) {
						results {
							... on NodePage {
								primaryNavigation {
									... on TermPrimaryNavigation {
										name
									}
								}
								image {
									... on MediaImage {
										image {
											alt
											height
											width
											url
										}
									}
								}
								title
							}
						}
					}
				}
			`,
			{
				id: id,
				status: status,
			},
		)
	)?.data?.contentRevisions?.results[0];

	// Get the menu name if the page has one.
	const menuName = page?.primaryNavigation?.name?.toUpperCase().replaceAll('-', '_');

	delete page.primaryNavigation;

	// We have to request the menu links separately.
	if (menuName) {
		// Since graphql doesn't allow recursive queries, we limit the depth of a menu to 6.
		const menu = (
			await graphql(
				`
					fragment MenuItemContent on MenuItem {
						url
						title
					}

					query GetMenu($menu: MenuAvailable!) {
						menu(name: $menu) {
							items {
								...MenuItemContent
								children {
									...MenuItemContent
									children {
										...MenuItemContent
										children {
											...MenuItemContent
											children {
												...MenuItemContent
												children {
													...MenuItemContent
												}
											}
										}
									}
								}
							}
						}
					}
				`,
				{
					menu: menuName,
				},
			)
		)?.data?.menu?.items;

		page.menu = menu;
	}

	return {
		props: { data: page },
	};
}

export default function Page({ data }) {
	const { isFallback } = useRouter();

	return (
		<Layout>
			<Container className={twJoin(isFallback && 'hidden')} centered>
				<Heading level={1}>{data?.title}</Heading>
			</Container>
		</Layout>
	);
}
