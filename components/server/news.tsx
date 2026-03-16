import { getNewsArticle } from "@/data/drupal/news";
import { notFound, redirect } from "next/navigation";
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
import { Info } from "@uoguelph/react-components/info";
import { HtmlParser } from "@/components/client/html-parser";
import { Divider } from "@uoguelph/react-components/divider";

export async function News({ id }: { id: string }) {
  const article = await getNewsArticle(id);

  if (!article) {
    notFound();
  }

  if (article.externallyLinked && article.externalLink && article.externalLink.url) {
    redirect(article.externalLink.url);
  }

  const tags: string[] = [];
  const units: string[] = [article.unit.id];

  article.tags?.forEach((tag) => {
    if (tag.__typename === "TermTag") {
      tags.push(tag.id);
    }
  });

  return (
    <Layout>
      <Header name={article.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <NewsBreadcrumbs data={article} />

      <LayoutContent>
        <div className="flex flex-col gap-3 mb-6">
          {Array.isArray(article.category) && article.category.length > 0 && (
            <Typography type="body" as="span" className="uppercase m-0 font-medium">
              {article.category.map((category) => category.name).join(", ")}
            </Typography>
          )}

          <Typography type="h1" as="h1" className="m-0">
            {article.title}
          </Typography>

          {article.leadParagraph && (
            <Info color="yellow">
              <Typography type="body" emphasize={true} as="span" className="m-0 text-2xl font-light leading-normal">
                {article.leadParagraph.value}
              </Typography>
            </Info>
          )}

          <div>
            {article.author && <strong className="pr-4 border-r border-grey-light-focus">{article.author}</strong>}
            <span className="even:pl-4">
              {new Date(article.created.time).toLocaleString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>

          {!article.doNotDisplayImage && article.hero && (
            <Image
              className="aspect-video w-full object-cover"
              src={article.hero.image.url}
              width={article.hero.image.width}
              height={article.hero.image.height}
              alt={article.hero.image.alt ?? ""}
            />
          )}
        </div>

        <Section
          primary={(article.widgets as Widgets[])?.map((widget, index) => (
            <WidgetSelector key={index} data={widget} />
          ))}
          secondary={<div></div>}
        />
      </LayoutContent>

      <CustomFooter tags={tags} units={units} />
      <Footer></Footer>
    </Layout>
  );
}
