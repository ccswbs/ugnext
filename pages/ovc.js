import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { getPageContent, getPageID, getPageMenu } from "@/data/drupal/basic-pages";
import { getFeaturedLegacyNews } from "@/data/drupal/ovchome";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import Image from "next/image";

import { Divider } from "@/components/divider";
import {
  FormatDateFull,
  // FormatEventDate,
  // FormatEventDay,
  // FormatEventMonth,
  // FormatEventWeekday,
} from "@/lib/date-utils";
import { twMerge } from "tailwind-merge";
import { OVCCards } from "@/components/ovchome/ovc-cards";
import { Link } from "@/components/link";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { Button } from "@/components/button";

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
    <div key={index} className={twMerge("tile", index === 0 ? "row-span-2" : "grid grid-cols-2 gap-4")}>
      {/* Image Section */}
      <div className={index === 0 ? "" : "tile"}>
        <Image
          src={newsItem?.heroImage.image.url}
          width={newsItem?.heroImage.image.width}
          height={newsItem?.heroImage.image.height}
          blurred={newsItem?.heroImage.image.blurDataURL}
          alt={newsItem?.heroImage.image.alt || "News Image"}
          className="object-cover"
        />
      </div>

      {/* Text Section */}
      <div className={index === 0 ? "" : "tile"}>
        <Heading
          level={index === 0 ? 3 : 5}
          as={"h3"}
          className={twMerge("font-condensed", index === 0 ? "text-dark" : "")}
        >
          <Link href={newsItem?.path}>{newsItem?.title}</Link>
        </Heading>
        <p>{newsItem?.articleDate}</p>
      </div>
    </div>
  );
}

export default function Page({ content }) {
  return (
    <Layout metadata={{ title: content?.title }} header={content?.menu}>
      {content?.image ? (
        <>
          <Hero
            variant="content-hub"
            image={{
              src: content.image.url,
              height: content.image.height,
              width: content.image.width,
              alt: content.image.alt,
            }}
            video={
              content?.heroWidgets?.video && {
                src: content.heroWidgets.video.url,
                title: content.heroWidgets.video.name,
                transcript: content.heroWidgets.video.transcript?.url,
              }
            }
            title={content.title}
          />
        </>
      ) : (
        <>
          <Container centered>
            <Heading level={1} className="mb-0">
              {content?.title}
            </Heading>
          </Container>
        </>
      )}

      {content?.widgets?.map((widget, index) => (
        <WidgetSelector key={index} data={widget} />
      ))}
      
      <Container centered>
        <Heading level={2} as={"h2"} className="font-condensed">
          Featured OVC News
          <Divider />
        </Heading>
        <div className="container m-auto grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
          {content?.featuredLegacyNews.map((newsItem, index) => renderFeaturedNewsItem(newsItem, index))}
        </div>
        <div className="pt-4">
          <Button href="/ovc/news/" color="red" className="py-2 px-4 mx-[.25em] text-2xl">
            OVC News Hub
          </Button>
          <Divider />
        </div>
        <div className="pt-6">
          <OVCCards />
        </div>
      </Container>
      <OVCFooter />
    </Layout>
  );
}
