import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Hero, HeroTitle } from "@uoguelph/react-components/hero";
import { Typography } from "@uoguelph/react-components/typography";
import { Header } from "@/components/header";
import { Meta } from "@/components/meta";
import { Footer } from "@uoguelph/react-components/footer";
import Image from "next/image";
import { getLegacyNews, getPageID } from "@/data/drupal/ovc-news";
import { getPageMenu } from "@/data/drupal/basic-pages";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { FormatDateFull } from "@/lib/date-utils";
import { HtmlParser } from "@/components/html-parser";
import { Container } from "@uoguelph/react-components/container";
import { useRouter } from "next/router";

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
  OVCMenu.primaryNavigation = {};
  OVCMenu.primaryNavigation.menuName = "ovc-main";

  legacyNewsItem.menu = await getPageMenu(OVCMenu);

  // Flatten image prop if doNoDisplay is false

  if (!legacyNewsItem?.doNotDisplayImage) {
    legacyNewsItem.heroImage = legacyNewsItem.heroImage?.image ?? null;
  } else {
    legacyNewsItem.heroImage = null;
  }

  return {
    props: { legacyNewsItem },
  };
}

export default function Page({ legacyNewsItem }) {
  const { isFallback } = useRouter();
  return (
    <Layout loading={isFallback}>
      <Meta title={legacyNewsItem?.title} />

      <Header
        title={legacyNewsItem?.menu?.topic?.title}
        url={legacyNewsItem?.menu?.topic?.url}
        menu={legacyNewsItem?.menu?.navigation}
      />

      <LayoutContent container={false}>
        {legacyNewsItem?.heroImage ? (
          <Hero
            variant="basic"
            src={legacyNewsItem.heroImage.url}
            alt={legacyNewsItem.heroImage.alt}
            height={legacyNewsItem.heroImage.height}
            width={legacyNewsItem.heroImage.width}
            priority
            as={Image}
          >
            <HeroTitle>{legacyNewsItem.title}</HeroTitle>
          </Hero>
        ) : (
          <Container>
            <Typography type="h1" as="h1" className="mb-0">
              {legacyNewsItem?.title}
            </Typography>
          </Container>
        )}

        <Container>
          {FormatDateFull(legacyNewsItem?.created?.time)}
          <div className="mt-5">
            <HtmlParser key={legacyNewsItem?.id} html={legacyNewsItem?.body?.processed} />
          </div>
        </Container>
      </LayoutContent>

      <OVCFooter />
      <Footer />
    </Layout>
  );
}
