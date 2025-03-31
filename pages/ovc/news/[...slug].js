import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
// import { getBreadcrumbs, getPageContent, getPageID, getPageMenu } from "@/data/drupal/legacy-news";
import { getPageID, getLegacyNews, getPageMenu } from "@/data/drupal/legacy-news";
import { FormatDateFull } from "@/lib/date-utils";
import { HtmlParser } from "@/components/html-parser";
import { GeneralText } from "@/components/widgets/general-text";

export async function getStaticPaths() {
  return {
    paths: [], //await getPaths(),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;

  // Try to get the ID of the page the user is requesting.
  const id = await getPageID("/" + context.params.slug.join("/"));

  // If we couldn't resolve an id, then that means this page doesn't exist on content hub, show a 404.
  if (!id) {
    return {
      notFound: true,
    };
  }

  // Now that we have the ID for the page we can request its content from its latest revision.
  const content = await getLegacyNews(id, status);

  if (!content) {
    return {
      notFound: true,
    };
  }
  const legacyNewsItem = content.legacyNews.results[0];

  legacyNewsItem.menu = await getPageMenu();

  // Flatten image prop
  legacyNewsItem.heroImage = legacyNewsItem.heroImage?.image ?? null;

  // wrap figcaption
  const figCap='<figcaption class="text-wrap width:' + '"350"'
  console.log(figCap)

  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('align-left', 'float-left mr-4 ml-4')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('align-right', 'float-right ml-4 mr-4')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('<figcaption', '<figcaption class="px-5  text-center text-lg font-semibold"')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('<figure role="group" class="', '<figure role="group" class="w-1/3 ')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('</figure>', '</figure>')


  return {
    props: { legacyNewsItem },
  };
}

export default function Page({ legacyNewsItem }) {
  
  return (

    <Layout metadata={{ title: legacyNewsItem?.title }} header={legacyNewsItem?.menu}>
      {legacyNewsItem?.heroImage ? (
        <>
          <Hero
            variant="content-hub"
            image={{
              src: legacyNewsItem.heroImage.url,
              height: legacyNewsItem.heroImage.height,
              width: legacyNewsItem.heroImage.width,
              alt: legacyNewsItem.heroImage.alt,
            }}
            title={legacyNewsItem.title}
          />
        </>
      ) : (
        <>
          <Container centered>
            <Heading level={1} className="mb-0">
              {legacyNewsItem?.title}
            </Heading>
          </Container>
        </>
      )}
      <Container centered>
        <div className="mt-5" >
          <HtmlParser key={legacyNewsItem?.id} html={legacyNewsItem?.body?.processed }/>
          
          </div>
      </Container>
    </Layout>
  );
}
