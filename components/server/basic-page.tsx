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
import React from "react";
import { CustomFooter } from "@/components/server/custom-footer";

export type BasicPageProps = {
  id: string;
  pre?: React.ReactNode;
  post?: React.ReactNode;
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

        <Breadcrumbs url={content.path ?? undefined} primary_navigation={content.primaryNavigation?.menuName ?? undefined} />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs url={content.path ?? undefined} primary_navigation={content.primaryNavigation?.menuName ?? undefined} />

      <Container>
        <Typography type="h1" as="h1">
          {content?.title}
        </Typography>
      </Container>
    </>
  );
}

export async function BasicPage({ id, pre, post }: BasicPageProps) {
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

  const { tags, units } = (content.tags ?? []).reduce(
    (acc, tag) => {
      if (tag.__typename === "TermTag") {
        acc.tags.push(tag.id);
      }

      if (tag.__typename === "TermUnit") {
        acc.units.push(tag.id);
      }
      return acc;
    },
    {
      tags: [] as string[],
      units: [] as string[],
    }
  );

  return (
    <Layout>
      <Header name={content.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <LayoutContent container={false}>
        <PageHero content={content} />

        {pre && pre}

        {content?.widgets?.map((widget, index) => (
          <WidgetSelector key={index} data={widget} />
        ))}

        {post && post}
      </LayoutContent>

      <CustomFooter tags={tags} units={units} />
      <Footer></Footer>
    </Layout>
  );
}
