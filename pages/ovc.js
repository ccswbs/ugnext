import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { getBreadcrumbs, getPageContent, getPageID, getPageMenu } from "@/data/drupal/basic-pages";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import eventsBG from "@/img/ovc/brick_leaf_background.jpg";
import Image from 'next/image'

// export async function getStaticPaths() {
//   return {
//     paths: [], //await getPaths(),
//     fallback: true,
//   };
// }
export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;

  // Try to get the ID of the page the user is requesting.
  const id = await getPageID("/ovc" );

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

  // Get rid of any data that doesn't need to be passed to the page.
//   delete content.primaryNavigation;

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
            <Heading level={1} as={"h2"} className="font-condensed text-black">
                OVC News
            </Heading>
            <Heading level={1} as={"h2"} className="font-condensed text-black">
                OVC Events
            </Heading>
            <Image 
                src = {eventsBG.src}
                width = {eventsBG.width}
                height = {eventsBG.height}
                blurred = {eventsBG.blurDataURL}
                alt = "Ivey covered building"
            />
            
        </Container>
    </Layout>
  );
}
