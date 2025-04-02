import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { getPageID, getLegacyNews, getPageMenu } from "@/data/drupal/legacy-news";
import { getFeaturedLegacyNews } from "@/data/drupal/ovchome";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import Image from "next/image";
import ovcCrest from "@/img/ovc/OVC-crest.png";
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

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;

  //   // Try to get the ID of the page the user is requesting.
  //   const id = await getPageID("/ovc");

  //   // If we couldn't resolve an id, then that means this page doesn't exist on content hub, show a 404.
  //   if (!id) {
  //     return {
  //       notFound: true,
  //     };
  //   }

  //   // Now that we have the ID for the page we can request its content from its latest revision.
  //   const content = await getPageContent(id, status);

  //   if (!content) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  const content = {};
  content.title = "Ontario Veterinary College News Hub";
  content.menu = await getPageMenu();
  content.img = null;

  //   // Get the featured OVC News - last 3 entered

  content.featuredLegacyNews = await getFeaturedLegacyNews();
  //  format the date created for each atricle
  content?.featuredLegacyNews.map((legacyNews) => {
    legacyNews.articleDate = FormatDateFull(legacyNews.created.time);
    legacyNews.path = "/ovc/news" + legacyNews.path;
  });

  //   // Get rid of any data that doesn't need to be passed to the page.
  //   delete content.primaryNavigation;

  // Flatten image prop
  content.image = content?.image?.image ?? null;

  //   //   content.breadcrumbs = (await getBreadcrumbs(context.params.slug)) ?? [];

  return {
    props: { content },
  };
}

export default function Page({ content }) {
  return (
    <Layout metadata={{ title: content?.title }} header={content?.menu}>
      <>
        <Container centered>
          <Heading level={1} className="mb-0">
            {content?.title}
          </Heading>
        </Container>
      </>

      {content?.widgets?.map((widget, index) => (
        <WidgetSelector key={index} data={widget} />
      ))}

      <Container centered>
        {/* <OVCStudyHere /> */}
        <Heading level={2} as={"h2"} className="font-condensed">
          Featured OVC News
          <Divider />
        </Heading>
        <div className="container m-auto grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-1 lg:grid-cols-2"></div>
      </Container>
      <OVCFooter />
    </Layout>
  );
}
