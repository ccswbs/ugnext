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
import { OVCStudyHere } from "@/components/ovchome/ovc-study-here";
import { StudyHere } from "@/components/home/study-here";
import { OVCFooter } from "@/components/ovc/ovc-footer";

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

  //   content.breadcrumbs = (await getBreadcrumbs(context.params.slug)) ?? [];

  return {
    props: { content },
  };
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
        {/* <OVCStudyHere /> */}
        <Heading level={2} as={"h2"} className="font-condensed">
          Featured OVC News
          <Divider />
        </Heading>
        <div className="container m-auto grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
          <div className="tile row-span-2 ">
            <Image
              src={content?.featuredLegacyNews[0]?.heroImage.image.url}
              width={content?.featuredLegacyNews[0]?.heroImage.image.width}
              height={content?.featuredLegacyNews[0]?.heroImage.image.height}
              blurred={content?.featuredLegacyNews[0]?.heroImage.image.blurDataURL}
              alt={content?.featuredLegacyNews[0]?.heroImage.image.alt}
            />
            <Heading level={3} as={"h3"} className="font-condensed text-dark">
              <Link href={content?.featuredLegacyNews[0]?.path}>{content?.featuredLegacyNews[0]?.title}</Link>
            </Heading>
            {content?.featuredLegacyNews[0]?.articleDate}
          </div>
          <div className="tile ">
            <div className="container m-auto grid grid-cols-2 gap-4">
              <div className="tile">
                <Image
                  src={content?.featuredLegacyNews[1]?.heroImage.image.url}
                  width={content?.featuredLegacyNews[1]?.heroImage.image.width}
                  height={content?.featuredLegacyNews[1]?.heroImage.image.height}
                  blurred={content?.featuredLegacyNews[1]?.heroImage.image.blurDataURL}
                  alt={content?.featuredLegacyNews[1]?.heroImage.image.alt}
                />
              </div>
              <div className="tile">
                <Heading level={5} as={"h3"} className="font-condensed">
                  <Link href={content?.featuredLegacyNews[1]?.path}>{content?.featuredLegacyNews[1]?.title}</Link>
                </Heading>
                {content?.featuredLegacyNews[1]?.articleDate}
              </div>
            </div>
          </div>
          <div className="tile ">
            <div className="container m-auto grid grid-cols-2  gap-4">
              <div className="tile ">
                <Image
                  src={content?.featuredLegacyNews[2]?.heroImage.image.url}
                  width={content?.featuredLegacyNews[2]?.heroImage.image.width}
                  height={content?.featuredLegacyNews[2]?.heroImage.image.height}
                  blurred={content?.featuredLegacyNews[2]?.heroImage.image.blurDataURL}
                  alt={content?.featuredLegacyNews[2]?.heroImage.image.alt}
                />
              </div>
              <div className="tile ">
                <Heading level={5} as={"h3"} className="font-condensed">
                  <Link href={content?.featuredLegacyNews[2]?.path}>{content?.featuredLegacyNews[2]?.title}</Link>
                </Heading>
                {content?.featuredLegacyNews[2]?.articleDate}
              </div>
            </div>
          </div>
        </div>
<div className = "pt-4"> <Divider /></div>
        <div className="pt-6">
          <OVCCards />
        </div>

      </Container>
      <OVCFooter />
    </Layout>
  );
}
