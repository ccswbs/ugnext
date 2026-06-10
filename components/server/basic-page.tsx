import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Header } from "@/components/server/header";
import { getPageContent, ProcessedBasicPage } from "@/data/drupal/basic-page";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";
import { Hero, HeroTitle, HeroVideo } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import React from "react";
import { CustomFooter } from "@/components/server/custom-footer";
import { cacheTag } from "next/cache";
import { DraftModeSiteButton } from "@/components/client/draft-mode/draft-mode-site-button";
import { toTitleCase } from "@/lib/string-utils";
import { getBasicPageLinkedCacheTags } from "@/data/drupal/linked-revalidation";

export type BasicPageProps = {
  id: string;
  pre?: React.ReactNode;
  post?: React.ReactNode;
};

function PageHero({ content }: { content: ProcessedBasicPage }) {
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

        <Breadcrumbs
          url={content.path ?? undefined}
          primary_navigation={content.primaryNavigation?.menuName ?? undefined}
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        url={content.path ?? undefined}
        primary_navigation={content.primaryNavigation?.menuName ?? undefined}
      />

      <Container>
        <Typography type="h1" as="h1">
          {content?.title}
        </Typography>
      </Container>
    </>
  );
}

export async function BasicPage({ id, pre, post }: BasicPageProps) {
  "use cache";

  const page = await getPageContent(id);

  // Couldn't fetch content for this id.
  if (!page) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Couldn't find content for basic page with id ${id}`);

      if (process.env.ALWAYS_SHOW_PUBLISHED_CONTENT) {
        console.warn("It's possible this page is not published. ALWAYS_SHOW_PUBLISHED_CONTENT is set to true.");
      }
    }

    notFound();
  }

  const cacheTags = getBasicPageLinkedCacheTags(page);
  cacheTag(...cacheTags);

  const customFooterID: string = page.primaryNavigation?.customFooter?.id ?? "";
  const { tags, units } = (page.tags ?? []).reduce(
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
      <Header name={page.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      {page.primaryNavigation && <DraftModeSiteButton primaryNavigation={page.primaryNavigation} />}

      <LayoutContent container={false}>
        <PageHero content={page} />

        {pre && pre}

        {page?.widgets?.map((widget, index) => (
          <WidgetSelector key={index} data={widget} primaryNavigation={page.primaryNavigation} />
        ))}

        {post && post}
      </LayoutContent>

      <CustomFooter tags={tags} units={units} id={customFooterID} />
      <Footer></Footer>
    </Layout>
  );
}
