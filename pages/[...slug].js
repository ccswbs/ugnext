import { getBreadcrumbs, getPageContent, getPageID, getPageMenu } from "@/data/drupal/basic-pages";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header, HeaderLink, HeaderMenu, HeaderMenuItem } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Hero, HeroTitle, HeroVideo } from "@uoguelph/react-components/hero";
import { Breadcrumbs, BreadcrumbHome, Breadcrumb } from "@uoguelph/react-components/breadcrumbs";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import Image from "next/image";
import { useRouter } from "next/router";
import { Meta } from "@/components/meta";

export async function getStaticPaths() {
  return {
    paths: [], //await getPaths(),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;

  // Try to get the ID of the page the user is requesting.
  const id = await getPageID("/" + context.params.slug.join("/"));

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
  delete content.primaryNavigation;

  // Flatten image prop
  content.image = content?.image?.image ?? null;

  content.breadcrumbs = (await getBreadcrumbs(context.params.slug)) ?? [];

  return {
    props: { content },
  };
}

function PageHeaderSubnavigation({ title, url, items }) {
  if (Array.isArray(items) && items.length > 0) {
    return (
      <HeaderMenu title={title}>
        {items.map((item, index) => (
          <HeaderMenuItem key={item.title + index}>
            <PageHeaderSubnavigation title={item.title} url={item.url} items={item.items} />
          </HeaderMenuItem>
        ))}
      </HeaderMenu>
    );
  }

  return <HeaderLink href={url}>{title}</HeaderLink>;
}

function PageLayout({ content, loading, children }) {
  return (
    <>
      <Header title={content?.menu?.topic?.title} url={content?.menu?.topic?.url}>
        {content?.menu?.navigation?.map((item) => (
          <PageHeaderSubnavigation key={item.title} title={item.title} url={item.url} items={item.items} />
        ))}
      </Header>

      <Layout loading={loading}>
        <LayoutContent container={false}>{children}</LayoutContent>
      </Layout>

      <Footer />
    </>
  );
}

function PageBreadcrumbs({ content }) {
  return (
    <Breadcrumbs>
      <BreadcrumbHome />
      {content?.breadcrumbs?.map((breadcrumb, index) => (
        <Breadcrumb key={breadcrumb.url} href={breadcrumb.url}>
          {breadcrumb.title}
        </Breadcrumb>
      ))}
    </Breadcrumbs>
  );
}

function PageWithHero({ content }) {
  return (
    <>
      <Hero
        alt={content.image.alt}
        height={content.image.height}
        width={content.image.width}
        src={content.image.url}
        variant="basic"
        priority
        as={Image}
      >
        <HeroTitle>{content.title}</HeroTitle>
        {content?.heroWidgets?.video && (
          <HeroVideo
            src={content.heroWidgets.video.url}
            title={content.heroWidgets.video.name}
            transcript={content.heroWidgets.video.transcript?.url}
          />
        )}
      </Hero>

      <PageBreadcrumbs content={content} />
    </>
  );
}

function PageWithoutHero({ content }) {
  return (
    <>
      <PageBreadcrumbs content={content} />

      <Container>
        <Typography type="h1" as="h1">
          {content?.title}
        </Typography>
      </Container>
    </>
  );
}

export default function Page({ content }) {
  const { isFallback } = useRouter();
  const title = " | University of Guelph";

  return (
    <>
      <Meta title={isFallback ? "Loading..." + title : content?.title + title} />
      <PageLayout content={content} loading={isFallback}>
        {content?.image ? <PageWithHero content={content} /> : <PageWithoutHero content={content} />}

        {content?.widgets?.map((widget, index) => (
          <WidgetSelector key={index} data={widget} />
        ))}
      </PageLayout>
    </>
  );
}