import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { Hero } from '@/components/hero';
import { getBreadcrumbs, getPageContent, getPageID, getPageMenu } from '@/data/drupal/basic-pages/basic-pages';
import { WidgetSelector } from '@/components/widgets/widget-selector';
import { Breadcrumbs } from '@/components/breadcrumbs';

export async function getStaticPaths() {
	return {
		paths: [], //await getPaths(),
		fallback: true,
	};
}
export async function getStaticProps(context) {
	const status = context?.preview || process.env.NODE_ENV !== 'production' ? null : true;

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

	if (!page) {
		return {
			notFound: true,
		};
	}

	page.menu = await getPageMenu(page);

	// Get rid of any data that doesn't need to be passed to the page.
	delete page.primaryNavigation;

	// Flatten image prop
	page.image = page?.image?.image ?? null;

	page.breadcrumbs = (await getBreadcrumbs(context.params.slug)) ?? [];

	return {
		props: { data: page },
	};
}

export default function Page({ data }) {
	const { isFallback } = useRouter();

	return (
		<Layout className={twJoin(isFallback && 'hidden')} title={data?.title} menu={data?.menu}>
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

			<Breadcrumbs links={data?.breadcrumbs} />

			<Container centered>
				{data?.widgets?.map((widget, index) => (
					<WidgetSelector key={index} data={widget} />
				))}
			</Container>
		</Layout>
	);
}
