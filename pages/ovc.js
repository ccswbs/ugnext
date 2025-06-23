import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Container } from "@uoguelph/react-components/container";
import { Hero, HeroTitle, HeroVideo } from "@uoguelph/react-components/hero";
import { Divider } from "@uoguelph/react-components/divider";
import { Button } from "@uoguelph/react-components/button";
import { Typography } from "@uoguelph/react-components/typography";
import { Link } from "@uoguelph/react-components/link";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { UnstyledLink } from "@/components/unstyled-link";
import { OVCCards } from "@/components/ovchome/ovc-cards";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import { getPageContent, getPageID, getPageMenu } from "@/data/drupal/basic-pages";
import { getFeaturedLegacyNews } from "@/data/drupal/ovc-news";
import Image from "next/image";
import { FormatDateFull } from "@/lib/date-utils";
import { twMerge } from "tailwind-merge";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import { Header } from "@/components/header";
import { Meta } from "@/components/meta";
import { Footer } from "@uoguelph/react-components/footer";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;

  // Try to get the ID of the page the user is requesting.
  const id = await getPageID("/ovc");

  // If we couldn't resolve an id, then that means this page doesn't exist on content hub, show a 404.
  if (!id) {
    return {
      notFound: true,
    };
  }

  // Now that we have the ID for the page we can request its content from its latest revision.
  const content = await getPageContent(id, status);

  if (!content) {
    return {
      notFound: true,
    };
  }

  content.menu = await getPageMenu(content);

  // Get the featured OVC News - last 3 entered

  content.featuredLegacyNews = await getFeaturedLegacyNews();

  // format the date created for each atricle
  content?.featuredLegacyNews?.map((legacyNews) => {
    legacyNews.articleDate = FormatDateFull(legacyNews.created.time);
    legacyNews.path = "/ovc/news" + legacyNews.path;
  });

  // Get rid of any data that doesn't need to be passed to the page.
  delete content.primaryNavigation;

  // Flatten image prop
  content.image = content?.image?.image ?? null;

  return {
    props: { content },
  };
}
// This function is used to render the featured news items
// It takes the news item and its index as arguments
function renderFeaturedNewsItem(newsItem, index) {
  return (
    <div
      key={index}
      className={twMerge(
        "tile overflow-hidden shadow-lg",
        index === 0 ? "row-span-2" : "grid grid-cols-1 lg:grid-cols-2 gap-4"
      )}
    >
      {/* Image Section */}
      <div className="relative">
        <Image
          src={newsItem?.heroImage?.image?.url || defaultImage.src}
          width={newsItem?.heroImage?.image?.width || defaultImage.width}
          height={newsItem?.heroImage?.image?.height || defaultImage.height}
          blurred={newsItem?.heroImage?.image?.blurDataURL || defaultImage.blurDataURL}
          alt={newsItem?.heroImage?.image?.alt || "OVC Front Entrance"}
          className="object-cover md:aspect-[9/4] h-full w-full"
        />
      </div>

      {/* Text Section */}
      <div className="p-4">
        <Typography
          type={"h5"}
          as={"h3"}
          className={twMerge("font-condensed! mt-0! text-lg", index === 0 ? "text-dark" : "")}
        >
          <Link href={newsItem?.path} className="hover:underline">
            {newsItem?.title}
          </Link>
        </Typography>
        <p className="text-sm text-grey-dark">{newsItem?.articleDate}</p>
      </div>
    </div>
  );
}

export default function Page({ content }) {
  return (
    <Layout>
      <Meta title={content?.title + " | University of Guelph"} />
      <Header title={content?.menu?.topic?.title} url={content?.menu?.topic?.url} menu={content?.menu?.navigation} />

      <LayoutContent container={false}>
        {content?.image ? (
          <>
            <Hero
              alt={content.image.alt}
              height={content.image.height}
              width={content.image.width}
              src={content.image.url}
              variant="basic"
              priority
              as={Image}
            >
              <HeroTitle>{content.title}</HeroTitle>
              {content?.heroWidgets?.video && (
                <HeroVideo
                  src={content.heroWidgets.video.url}
                  title={content.heroWidgets.video.name}
                  transcript={content.heroWidgets.video.transcript?.url}
                />
              )}
            </Hero>
          </>
        ) : (
          <>
            <Container>
              <Typography type="h1" as="h1" className="mb-0">
                {content?.title}
              </Typography>
            </Container>
          </>
        )}

        {content?.widgets?.map((widget, index) => (
          <WidgetSelector key={index} data={widget} />
        ))}

        <Container>
          <Typography type="h2" as="h2" className="font-condensed">
            Featured OVC News
            <Divider />
          </Typography>
          <div className="m-auto grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
            {content?.featuredLegacyNews.map((newsItem, index) => renderFeaturedNewsItem(newsItem, index))}
          </div>
          <div className="pt-4">
            <Button as={UnstyledLink} href="/ovc/news/" color="red" className="py-2 px-4 mx-[.25em] text-2xl">
              OVC News Hub
            </Button>
            <Divider />
          </div>
          <div className="pt-6">
            <OVCCards />
          </div>
        </Container>
      </LayoutContent>

      <OVCFooter />
      <Footer />
    </Layout>
  );
}
