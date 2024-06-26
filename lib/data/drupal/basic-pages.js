import { graphql } from '@/lib/drupal';
import { toTitleCase } from '@/lib/string-utils';

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

export const getPageContent = async (id, status) => {
	const { data } = await graphql(
		`
			fragment Navigation on TermPrimaryNavigation {
				menuName
			}

			fragment Image on MediaImage {
				image {
					alt
					height
					width
					url
				}
			}

			fragment Accordion on ParagraphAccordionBlock {
				__typename
				headingLevel
				title
				text {
					processed
				}
			}

			fragment GeneralText on ParagraphGeneralText {
				__typename
				body {
					processed
				}
			}

			fragment Buttons on ParagraphButtonWidget {
				ctaHeading {
					processed
				}
				fontAwesomeIcon
				formattedTitle {
					processed
				}
				link {
					title
					url
				}
				fontAwesomeIconColour {
					... on TermColourVariable {
						name
					}
				}
			}

			fragment Links on ParagraphLinksWidget {
				links {
					... on ParagraphLinkItem {
						url {
							title
							url
						}
						image {
							...Image
						}
						description
					}
				}
			}

			fragment MediaText on ParagraphMediaText {
				__typename
				heading: title
				media {
					...Image
				}
				mediaAlignment
				mediaImageSize
				sectionColumn {
					... on TermSectionColumn {
						name
					}
				}
				headingLevel
				description {
					processed
				}
				background {
					... on TermBgColor {
						name
					}
				}
			}

			fragment ButtonSection on ParagraphSectionButton {
				__typename
				buttons {
					...Buttons
				}
			}

			fragment Tabs on ParagraphSectionTab {
				__typename
				tabs {
					... on ParagraphTabContent {
						body {
							processed
						}
						title
					}
				}
				sectionColumn {
					... on TermSectionColumn {
						name
					}
				}
			}

			fragment Statistics on ParagraphStatisticWidget {
				__typename
				content {
					... on ParagraphStatisticItem {
						image {
							...Image
						}
						fontAwesomeIcon
						represents {
							processed
						}
						value
					}
				}
				style {
					... on TermStatisticStyle {
						name
					}
				}
			}

			fragment Section on ParagraphSection {
				heading: title
				headingLevel
				content {
					...Accordion
					...GeneralText
					...Buttons
					...Links
					...MediaText
					...ButtonSection
					...Tabs
					...Statistics
				}
			}

			query GetPage($id: String = "", $status: Boolean = false) {
				contentRevisions(filter: { id: $id, status: $status, type: "page" }, pageSize: 1) {
					results {
						... on NodePage {
							primaryNavigation {
								...Navigation
							}
							image {
								...Image
							}
							title
							widgets {
								...Accordion
								...GeneralText
								...Buttons
								...Links
								...MediaText
								...ButtonSection
								...Tabs
								...Statistics
								...Section
							}
							changed {
								timestamp
							}
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

	return data?.menu?.items ?? null;
};

export const getPageTitle = async (id, status) => {
	const { data } = await graphql(
		`
			query GetPage($id: String = "", $status: Boolean = null) {
				contentRevisions(filter: { id: $id, status: $status, type: "page" }, pageSize: 1) {
					results {
						... on NodePage {
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

	return data?.contentRevisions?.results[0]?.title ?? null;
};

export const getBreadcrumbs = async (slug, status) => {
	const crumbs = [];
	const stack = slug.slice(0, -1);

	while (stack.length > 0) {
		const url = '/' + stack.join('/');
		const id = await getPageID(url);
		const title = await getPageTitle(id, status);

		crumbs.unshift({
			title: title ? title : toTitleCase(stack[stack.length - 1]),
			url: url,
		});

		stack.pop();
	}

	return crumbs;
};
