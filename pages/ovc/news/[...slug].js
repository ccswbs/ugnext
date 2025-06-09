import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { getLegacyNews, getPageID } from "@/data/drupal/ovc-news";
import { getPageMenu } from "@/data/drupal/basic-pages";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { FormatDateFull } from "@/lib/date-utils";
import { HtmlParser } from "@/components/html-parser";

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
  const legacyNewsItem = content.legacyNewsItem.results[0];
  // Note: change the legacyNewsItem to legacyNewsRevision for the revision query (or vice versa) 
  // Also change the query in the drupal module in get-legacy-news-content.graphql

   let OVCMenu = {};
  OVCMenu.primaryNavigation =  {};
  OVCMenu.primaryNavigation.menuName =  "ovc-main";
  

  legacyNewsItem.menu = await getPageMenu(OVCMenu);

  // Flatten image prop if doNoDisplay is false

  if (!legacyNewsItem?.doNotDisplayImage)  {
       legacyNewsItem.heroImage = legacyNewsItem.heroImage?.image ?? null;
    } else {
      legacyNewsItem.heroImage = null;
    };


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
        {FormatDateFull(legacyNewsItem?.created?.time)}
        <div className="mt-5">
          <HtmlParser key={legacyNewsItem?.id} html={legacyNewsItem?.body?.processed} />
        </div>
      </Container>
      <OVCFooter />
    </Layout>
  );
}
