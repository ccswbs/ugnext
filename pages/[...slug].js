import { useRouter } from 'next/router';
import { graphql } from '@/lib/drupal';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { twJoin } from 'tailwind-merge';

export async function getStaticPaths() {
	let paths = [];

	return {
		paths: paths,
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
	console.log(data);

	return (
		<Layout>
			{isFallback && (
				<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red">
					<FontAwesomeIcon className="w-[5em] animate-spin opacity-45" icon={faSpinner} />
				</div>
			)}
			<Container className={twJoin(isFallback && 'hidden')} centered>
				<Heading level={1}>{data?.title}</Heading>
			</Container>
		</Layout>
	);
}
