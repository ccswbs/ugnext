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
import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import Link from "next/link";
import { NewsFragment } from "@/lib/graphql/types";
import { NewsTimeEstimate } from "@/components/client/news/news-time-estimate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@awesome.me/kit-7993323d0c/icons/classic/solid";

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

  let directory: string;

  if (
    article.primaryNavigation &&
    article.primaryNavigation.newsUrlAliasPattern &&
    article.primaryNavigation.menuName !== "no-menu"
  ) {
    directory = `/news${article.primaryNavigation.newsUrlAliasPattern}`;
  } else {
    directory = "/news";
  }

  type ArticleWidgets = NonNullable<NewsFragment["widgets"]>;

  const primaryWidgets: ArticleWidgets = [];
  const secondaryWidgets: ArticleWidgets = [];

  for (const widget of article?.widgets ?? []) {
    switch (widget.__typename) {
      case "ParagraphGeneralText":
      case "ParagraphBlockWidget":
      case "ParagraphMediaText":
        if (widget.sectionColumn.name.toLowerCase() === "secondary") {
          secondaryWidgets.push(widget);
          continue;
        }
        break;
      case "ParagraphSectionButton":
        if (widget.buttonSectionColumn.name.toLowerCase() === "secondary") {
          secondaryWidgets.push(widget);
          continue;
        }
        break;
    }

    primaryWidgets.push(widget);
  }

  return (
    <Layout>
      <Header name={article.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>

      <Breadcrumbs>
        <BreadcrumbHome />

        {article.primaryNavigation.primaryNavigationUrl?.url && (
          <Breadcrumb href={article.primaryNavigation.primaryNavigationUrl.url}>
            {article.primaryNavigation.name}
          </Breadcrumb>
        )}

        <Breadcrumb href={directory} as={Link}>
          News
        </Breadcrumb>

        <Breadcrumb as="span">{article.title}</Breadcrumb>
      </Breadcrumbs>

      <LayoutContent container={true}>
        <div className="flex flex-col gap-5 mb-6">
          {Array.isArray(article.category) && article.category.length > 0 && (
            <Typography type="body" as="span" className="flex uppercase m-0 font-medium">
              {article.category.map((category) => (
                <Link
                  className="hocus:text-blue transition-colors not-first:pl-2 not-last:pr-2 not-first:border-l-2 border-grey-light-focus"
                  key={category.id}
                  href={`${directory}?categories=${category.id}`}
                >
                  {category.name}
                </Link>
              ))}
            </Typography>
          )}

          <Typography type="h1" as="h1" className="m-0">
            {article.title}
          </Typography>

          {article.leadParagraph && (
            <Info color="yellow">
              <Typography type="body" emphasize={true} as="span" className="m-0 text-2xl font-light leading-normal">
                {article.leadParagraph}
              </Typography>
            </Info>
          )}

          <div>
            {article.author && <strong className="pr-4 border-r-2 border-grey-light-focus">{article.author}</strong>}
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

          <div className="flex items-center">
            <NewsTimeEstimate />
            <button className="inline-flex cursor-pointer items-center gap-1 pl-4 border-l-2 border-grey-light-focus">
              <FontAwesomeIcon icon={faShare} />
              Share
            </button>
          </div>
        </div>

        <div id="uofg-news-article-content">
          <Section
            primary={[
              <div key="share-and-read-info"></div>,
              ...primaryWidgets.map((widget, index) => <WidgetSelector key={index} data={widget} />),
            ]}
            secondary={[
              article.hero?.image && (
                <Typography key="lead-image" type="body" as="span">
                  {article.heroDescription && (
                    <>
                      <strong>Lead Image:</strong> {article.heroDescription}
                    </>
                  )}
                </Typography>
              ),
              ...secondaryWidgets.map((widget, index) => <WidgetSelector key={index} data={widget} />),
            ]}
          />
        </div>
      </LayoutContent>

      <CustomFooter tags={tags} units={units} />
      <Footer></Footer>
    </Layout>
  );
}
