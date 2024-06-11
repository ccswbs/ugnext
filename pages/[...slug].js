import { useRouter } from 'next/router';
import { graphql } from '@/lib/drupal';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { Hero } from '@/components/hero';

export async function getStaticPaths() {
	// Here we can decide which pages get pre-rendered.
	let paths = [];
	let page = 0;
	const pageSize = 100;
	let hasNextPage = true;
	const limit = 1500; // Add a limit to the number of pages we prebuild

	while (hasNextPage && paths.length < limit) {
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

async function getPageID(url) {
	const { data } = await graphql(
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
			url: url,
		},
	);

	return data?.route?.entity?.id;
}

async function getPageContent(id, status) {
	const { data } = await graphql(
		`
			query GetPage($id: String = "", $status: Boolean = null) {
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
	);

	return data?.contentRevisions?.results[0];
}

async function getPageMenu(page) {
	const name = page?.primaryNavigation?.name?.toUpperCase()?.replaceAll('-', '_');

	if (!name) {
		return null;
	}

	const { data } = await graphql(
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
			menu: name,
		},
	);

	const menu = data?.menu?.items ?? null;

	return data?.menu?.items ?? null;
}

export async function getStaticProps(context) {
	const isPreview = context?.preview;
	const status = isPreview ? null : true;

	// Try to get the ID of the page the user is requesting.
	const id = await getPageID('/' + context.params.slug.join('/'));

	// If we couldn't resolve an id, then that means this page doesn't exist on content hub, show a 404.
	if (!id) {
		return {
			notFound: true,
		};
	}

	// Now that we have the ID for the page we can request its content from its latest revision.
	const page = await getPageContent(id, status);
	page.menu = await getPageMenu(page);

	// Get rid of any data that doesn't need to be passed to the page.
	delete page.primaryNavigation;

	// Flatten image prop
	page.image = page?.image?.image ?? null;

	return {
		props: { data: page },
	};
}

export default function Page({ data }) {
	const { isFallback } = useRouter();

	console.log(data.menu ?? null);

	return (
		<Layout className={twJoin(isFallback && 'hidden')}>
			{data?.image ? (
				<Hero
					variant="ch"
					src={data.image.url}
					height={data.image.height}
					width={data.image.width}
					alt={data.image.alt}
					title={data.title}
				/>
			) : (
				<Container centered>
					<Heading level={1}>{data?.title}</Heading>
				</Container>
			)}
		</Layout>
	);
}
