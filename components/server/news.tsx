import { getNewsArticle } from "@/data/drupal/news";
import { notFound } from "next/navigation";
import { Header } from "@/components/server/header";
import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { CustomFooter } from "@/components/server/custom-footer";
import { Footer } from "@uoguelph/react-components/footer";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Hero, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Widgets } from "@/data/drupal/widgets";
import { NewsBreadcrumbs } from "@/components/client/news/news-breadcrumbs";
import { Section } from "@/components/client/section";
import { NewsSidebar } from "@/components/client/news/news-sidebar";

export async function News({ id }: { id: string }) {
  const article = await getNewsArticle(id);

  if (!article) {
    notFound();
  }

  const tags: string[] = [];
  const units: string[] = [article.unit.id];

  article.tags?.forEach((tag) => {
    if (tag.__typename === "TermTag") {
      tags.push(tag.id);
    }
  });

  console.log(article);

  return (
    <Layout>
      <Header name={article.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <LayoutContent container={false}>
        {article.doNotDisplayImage || !article.hero ? (
          <Container>
            <Typography type="h1" as="h1">
              {article.title}
            </Typography>
          </Container>
        ) : (
          <Hero
            as={Image}
            src={article.hero.image.url}
            width={article.hero.image.width}
            height={article.hero.image.height}
            alt={article.hero.image.alt ?? ""}
            variant="basic"
          >
            <HeroTitle>{article.title}</HeroTitle>
          </Hero>
        )}

        <NewsBreadcrumbs
          title={article.title}
          primaryNavigation={article.primaryNavigation}
          categories={article.category ?? []}
        />

        <Container>
          <Section
            primary={(article.widgets as Widgets[])?.map((widget, index) => (
              <WidgetSelector key={index} data={widget} />
            ))}
            secondary={<NewsSidebar data={article} />}
          />
        </Container>
      </LayoutContent>

      <CustomFooter tags={tags} units={units} />
      <Footer></Footer>
    </Layout>
  );
}
