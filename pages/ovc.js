// Note: events code is commented out - but will be used in the future 

import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { getPageContent, getPageID, getPageMenu } from "@/data/drupal/basic-pages";
import { getFeaturedLegacyNews } from "@/data/drupal/ovchome";
// import { getFeaturedLegacyEvents } from "@/data/drupal/ovchome";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import eventsBG from "@/img/ovc/brick_leaf_background_gray.jpg";
import Image from "next/image";
import ovcLogo from "@/img/ovc/OVC__GUELPH_FULLCOLOUR_WHITEBG_V1_1.5IN_H_300PPI.png";
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
  content?.featuredLegacyNews.map((legacyNews) => {
    legacyNews.articleDate = FormatDateFull(legacyNews.created.time);
    legacyNews.path = "/ovc/news" + legacyNews.path;
  });

  // Get the featured OVC Events - last 4 entered

  // content.featuredLegacyEvents = await getFeaturedLegacyEvents();

  // format the start and end date created for each event - not needed for now - but keep for future
  // content?.featuredLegacyEvents.map((legacyEvent, index) => {
  //   legacyEvent.eventStartDate = FormatEventDate(legacyEvent.date.start.time);
  //   legacyEvent.eventEndDate = FormatEventDate(legacyEvent.date.end.time);
  //   legacyEvent.eventMonth = FormatEventMonth(legacyEvent.date.start.time);
  //   legacyEvent.eventDay = FormatEventDay(legacyEvent.date.start.time);
  //   // delete non-current events

  //   if (legacyEvent.date.end.timestamp < Date.now() / 1000) {
  //     delete content.featuredLegacyEvents[index];
  //   }
  // });

  // // remove emply elements from the featuredLegacyEvents array
  // content.featuredLegacyEvents = content.featuredLegacyEvents.filter((value) => Object.keys(value).length !== 0);

  // // reversie featuredLegacyEvents to display in right order
  // content.featuredLegacyEvents.reverse();

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
        <Heading level={2} as={"h2"} className="font-condensed">
          Featured OVC News
          <Divider />
        </Heading>

        <div className="container m-auto grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
          <div className="tile row-span-2 ">
            <Image
              src={content.featuredLegacyNews[0].heroImage.image.url}
              width={content.featuredLegacyNews[0].heroImage.image.width}
              height={content.featuredLegacyNews[0].heroImage.image.height}
              blurred={content.featuredLegacyNews[0].heroImage.image.blurDataURL}
              alt={content.featuredLegacyNews[0].heroImage.image.alt}
            />
            <Heading level={3} as={"h3"} className="font-condensed text-dark">
              <Link href={content.featuredLegacyNews[0].path}>{content.featuredLegacyNews[0].title}</Link>
            </Heading>
            {content.featuredLegacyNews[0].articleDate}
          </div>
          <div className="tile ">
            <div className="container m-auto grid grid-cols-2 gap-4">
              <div className="tile">
                <Image
                  src={content.featuredLegacyNews[1].heroImage.image.url}
                  width={content.featuredLegacyNews[1].heroImage.image.width}
                  height={content.featuredLegacyNews[1].heroImage.image.height}
                  blurred={content.featuredLegacyNews[1].heroImage.image.blurDataURL}
                  alt={content.featuredLegacyNews[1].heroImage.image.alt}
                />
              </div>
              <div className="tile">
                <Heading level={5} as={"h3"} className="font-condensed">
                  <Link href={content.featuredLegacyNews[1].path}>{content.featuredLegacyNews[1].title}</Link>
                </Heading>
                {content.featuredLegacyNews[1].articleDate}
              </div>
            </div>
          </div>
          <div className="tile ">
            <div className="container m-auto grid grid-cols-2  gap-4">
              <div className="tile ">
                <Image
                  src={content.featuredLegacyNews[2].heroImage.image.url}
                  width={content.featuredLegacyNews[2].heroImage.image.width}
                  height={content.featuredLegacyNews[2].heroImage.image.height}
                  blurred={content.featuredLegacyNews[2].heroImage.image.blurDataURL}
                  alt={content.featuredLegacyNews[2].heroImage.image.alt}
                />
              </div>
              <div className="tile ">
                <Heading level={5} as={"h3"} className="font-condensed">
                  <Link href={content.featuredLegacyNews[2].path}>{content.featuredLegacyNews[2].title}</Link>
                </Heading>
                {content.featuredLegacyNews[2].articleDate}
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="flex w-full flex-col">
          <div className="relative flex w-full items-center justify-center overflow-hidden">
            <div className="absolute z-0 h-full max-h-full w-full">
              <Image
                src={eventsBG.src}
                alt={eventsBG.alt}
                className={twMerge("w-full h-full object-cover", eventsBG?.className)}
                width={eventsBG?.width}
                height={eventsBG?.height}
                sizes="100vw"
                placeholder={eventsBG?.blurred ? "blur" : "empty"}
                blurDataURL={eventsBG?.blurred}
              />
            </div>

            {/*  // Events has been put on hold for now - leaving the commented out code for when it is needed 

            <div className="container z-10 flex w-full max-w-max-content flex-col gap-6 px-4 ">
              <Heading level={2} as={"h2"} className="font-condensed text-white ">
                OVC Events
              </Heading>
              <div className="flex w-full px-8 lg:p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-3 gap-2 p-4 ">
                  {content?.featuredLegacyEvents?.map((legacyEvent, index) => (
                    <div key={index} className="grid grid-cols-8">
                      <div className="col-span-2  bg-white opacity-100 border-yellow-300 border-8 flex justify-center items-center uppercase">
                        {legacyEvent.eventMonth}
                        <br />
                        {legacyEvent.eventDay}
                      </div>
                      <div className="col-span-6 border-white bg-white border-8 flex items-center">
                        {legacyEvent.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="pt-6">
          <OVCCards />
        </div>
      </Container>
      <div className={"w-full py-5 bg-gray-100"}>
        <Container centered>
          {/* <div className={containerClasses}> */}
          <div className="grid items-center gap-4 sm:grid sm:grid-cols-[2fr_2fr] md:grid-cols-[2fr_5fr] ">
            <div className="place-items-center">
              <Image
                src={ovcCrest.src}
                width={200}
                height={200}
                alt="Ontario Veterinary College - Crest"
                placeholder={ovcCrest?.blurred ? "blur" : "empty"}
                blurDataURL={ovcCrest?.blurred}
              />
            </div>
            <div className="text-lg ">
              The Ontario Veterinary College (OVC) at the University of Guelph is a world leader in advancing veterinary
              medicine and health research to improve the health of animals, people, and our planet. OVC educates the
              next generation of health leaders and provides high-value experiential learning opportunities through an
              interdisciplinary, comparative approach aimed at finding real-world solutions to real-world problems.
            </div>
          </div>
          <div className="flex justify-between ">
            <div>
              <Heading level={1} as={"h2"} className="font-condensed text-black">
                Social Media
              </Heading>
              Place holder
            </div>
            <div className="text-lg">
              <Heading level={1} as={"h2"} className="font-condensed text-black">
                Units
              </Heading>
              <ul>
                <li>
                  <Link href="https://ovc.uoguelph.ca/biomedical-sciences/">Department of Biomedical Sciences</Link>
                </li>
                <li>
                  <Link href="https://ovc.uoguelph.ca/clinical-studies/">Department of Clinical Studies</Link>
                </li>
                <li>
                  <Link href="https://ovc.uoguelph.ca/pathobiology/">Department of Pathobiology</Link>
                </li>
                <li>
                  <Link href="https://ovc.uoguelph.ca/population-medicine/">Department of Population Medicine</Link>
                </li>
                <li>
                  <Link href="https://www.ovchsc.ca/">Health Sciences Centre</Link>
                </li>
              </ul>
            </div>
            <div className="text-lg">
              <Heading level={1} as={"h2"} className="font-condensed ">
                Connect with OVC
              </Heading>
              <ul className="lead font-weight-bold list-unstyled">
                <li>
                  <Link href="https://www.google.com/maps/place/Ontario+Veterinary+College+Health+Sciences+Centre/@43.5312879,-80.2345029,17z/data=!3m1!4b1!4m5!3m4!1s0x882b9ad624240187:0x95a5348b4bf4b543!8m2!3d43.5312879!4d-80.2323142">
                    Find us on a map
                  </Link>
                </li>
                <li>
                  <Link href="http://www.ovc.uoguelph.ca/recruitment/en/experienceovc/tours.asp">Take a tour</Link>
                </li>
                <li>
                  <Link href="https://www.uoguelph.ca/ovc/contact">Contact</Link>
                </li>
                <li>
                  <Link href="https://uoguelphca.sharepoint.com/sites/OntarioVeterinaryCollege">Intranet</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* </div> */}
        </Container>
      </div>
    </Layout>
  );
}
