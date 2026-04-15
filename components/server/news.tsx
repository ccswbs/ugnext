import { FullNewsArticle, getNewsArticle } from "@/data/drupal/news";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/server/header";
import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { CustomFooter } from "@/components/server/custom-footer";
import { Footer } from "@uoguelph/react-components/footer";
import { Typography } from "@uoguelph/react-components/typography";
import Image from "next/image";
import { Section } from "@/components/client/section";
import { Info } from "@uoguelph/react-components/info";
import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import Link from "next/link";
import { Link as UofGLink } from "@uoguelph/react-components/link";
import { NewsFragment } from "@/lib/graphql/types";
import { NewsTimeEstimate } from "@/components/client/news/news-time-estimate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { ProcessedWidget } from "@/data/drupal/widgets";
import { NewsShare } from "@/components/client/news/news-share";
import { customRandom } from "nanoid";

function NewsBreadcrumbs({ article }: { article: FullNewsArticle }) {
  return (
    <Breadcrumbs>
      <BreadcrumbHome href="/" />
      {article.unitHome.title && 
        <Breadcrumb href={article.unitHome.url} as={Link}>
          {article.unitHome.title}
        </Breadcrumb>}
        
      {article.newsHome.title && 
        <Breadcrumb href={article.newsHome.url} as={Link}>
          {article.newsHome.title}
        </Breadcrumb>}

      {article.directory.title && 
        <Breadcrumb href={article.directory.url} as={Link}>
          {article.directory.title}
        </Breadcrumb>}

    </Breadcrumbs>
  );
}

function NewsSidebar({ article }: { article: FullNewsArticle }) {
  return (
    <div>
      {article.hero?.image && article.heroDescription && (
        <div>
          <Typography key="lead-image" type="h5" as="div" className="mt-0 pt-0">
            Lead Image
          </Typography>
          <Typography key="lead-image-description" type="body" as="span">
            {article.heroDescription}
          </Typography>
        </div>
      )}

      {Array.isArray(article.category) && article.category.length > 0 && (
        <div>
          <Typography type="h5" as="div">
            Categories
          </Typography>
          <div className="flex flex-col">
            {article.category.map((category) => (
              <UofGLink key={category.id} href={`${article.directory.url}?categories=${category.id}`}>
                {category.name}
              </UofGLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NewsLeadParagraph({ article }: { article: FullNewsArticle }) {
  if (!article.leadParagraph) {
    return <></>;
  }

  return (
    <Info color="yellow">
      <Typography type="body" emphasize={true} as="span" className="m-0 text-2xl font-light leading-normal">
        {article.leadParagraph}
      </Typography>
    </Info>
  );
}

function NewsPublishInfo({ article }: { article: FullNewsArticle }) {
  return (
    <div className="flex md:items-center flex-col md:flex-row gap-2 md:gap-0">
      {article.author && <strong className="md:pr-4 md:border-r-2 border-grey-light-focus">{article.author}</strong>}
      <span className="md:even:pl-4">
        {new Date(article.datePublished.time).toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}
      </span>
    </div>
  );
}

function NewsHero({ article }: { article: FullNewsArticle }) {
  if (!article.hero || article.doNotDisplayImage) {
    return <></>;
  }

  return (
    <Image
      className="aspect-video w-full object-cover"
      src={article.hero.image.url}
      width={article.hero.image.width}
      height={article.hero.image.height}
      alt={article.hero.image.alt ?? ""}
    />
  );
}

function NewsShareAndReadInfo({ article }: { article: FullNewsArticle }) {
  return (
    <div className="flex items-center">
      <NewsTimeEstimate />
      <NewsShare title={article.title} />
    </div>
  );
}

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
  const customFooterID: string = article.primaryNavigation?.customFooter?.id ?? "";

  article.tags?.forEach((tag) => {
    if (tag.__typename === "TermTag") {
      tags.push(tag.id);
    }
  });

  const primaryWidgets: ProcessedWidget[] = [];
  const secondaryWidgets: ProcessedWidget[] = [];

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

      <NewsBreadcrumbs article={article} />

      <LayoutContent container={true}>
        <div className="flex flex-col gap-5 mb-6">
          {Array.isArray(article.category) && article.category.length > 0 && (
            <Typography type="body" as="span" className="flex uppercase m-0 font-medium">
              {article.category[0].name}
            </Typography>
          )}

          <Typography type="h1" as="h1" className="m-0">
            {article.title}
          </Typography>

          <NewsLeadParagraph article={article} />

          <NewsPublishInfo article={article} />

          <NewsHero article={article} />
        </div>

        <div id="uofg-news-article-content">
          <Section
            primary={[
              <NewsShareAndReadInfo article={article} key="share-and-read" />,
              ...primaryWidgets.map((widget, index) => <WidgetSelector key={index} data={widget} />),
            ]}
            secondary={[
              <NewsSidebar article={article} key="sidebar" />,
              ...secondaryWidgets.map((widget, index) => <WidgetSelector key={index} data={widget} />),
            ]}
          />
        </div>
      </LayoutContent>

      <CustomFooter id={customFooterID} />
      <Footer></Footer>
    </Layout>
  );
}
