import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Header } from "@/components/server/header";
import { getPageContent } from "@/data/drupal/basic-page";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";
import { Hero, HeroTitle, HeroVideo } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";

export type BasicPageProps = {
  id: string;
};

type PageContent = NonNullable<Awaited<ReturnType<typeof getPageContent>>>;

function PageHero({ content }: { content: NonNullable<PageContent> }) {
  if (content.image) {
    return (
      <>
        <Hero
          alt={content.image.image.alt ?? ""}
          height={content.image.image.height}
          width={content.image.image.width}
          src={content.image.image.url}
          variant="basic"
          priority
          as={Image}
        >
          <HeroTitle>{content.title}</HeroTitle>
          {content.heroWidgets?.video && (
            <HeroVideo
              src={content.heroWidgets.video.url}
              title={content.heroWidgets.video.name}
              transcript={content.heroWidgets.video.transcript?.url}
            />
          )}
        </Hero>

        <Breadcrumbs url={content.path ?? undefined} />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs url={content.path ?? undefined} />

      <Container>
        <Typography type="h1" as="h1">
          {content?.title}
        </Typography>
      </Container>
    </>
  );
}

export async function BasicPage({ id }: BasicPageProps) {
  const content = await getPageContent(id);

  // Couldn't fetch content for this id.
  if (!content) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Couldn't find content for basic page with id ${id}`);

      if (process.env.ALWAYS_SHOW_PUBLISHED_CONTENT) {
        console.warn("It's possible this page is not published. ALWAYS_SHOW_PUBLISHED_CONTENT is set to true.");
      }
    }

    notFound();
  }

  return (
    <Layout>
      <Header name={content.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <LayoutContent container={false}>
        <PageHero content={content} />

        {content?.widgets?.map((widget, index) => <WidgetSelector key={index} data={widget} />)}
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
