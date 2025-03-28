import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
// import { getBreadcrumbs, getPageContent, getPageID, getPageMenu } from "@/data/drupal/legacy-news";
import { getPageID, getLegacyNews, getPageMenu } from "@/data/drupal/legacy-news";
import { FormatDateFull } from "@/lib/date-utils";

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
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('<p', '<div class="col-span-1"')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('</p', '</div')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('<h2>', '<div class="col-span-1"> <h2>')
  legacyNewsItem.body.processed = legacyNewsItem.body.processed.replaceAll('</h2>', '</h2> </div>')


  return {
    props: { legacyNewsItem },
  };
}

export default function Page({ legacyNewsItem }) {
  const imagetest =
    '<figure class="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0"> <a href="#"> <img class="rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png" alt="image description"> </a>  <figcaption class=" px-4 text-lg bottom-6">      <p>Do you want to get notified when a new component is added to Flowbite?</p></figcaption></figure>';

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
      {console.log("........", legacyNewsItem)}
      <Container centered>
        {FormatDateFull(legacyNewsItem?.created?.time)}
        <div className="mt-5 grid grid-cols-1 gap-4" dangerouslySetInnerHTML={{ __html: legacyNewsItem?.body?.processed }} />{" "}
      </Container>
    </Layout>
  );
}
