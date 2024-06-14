import { graphql } from '@/lib/drupal';

export const getPaths = async () => {
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

	return paths.map((node) => ({
		params: {
			slug: node?.path?.split('/').filter(Boolean),
		},
	}));
};

export const getPageID = async (url) => {
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
};

export const getPageContent = async (id, preview) => {
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
			status: preview,
		},
	);

	return data?.contentRevisions?.results[0];
};

export const getPageMenu = async (page) => {
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
};
