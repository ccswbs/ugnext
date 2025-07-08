import { getNewsArticle } from "@/data/drupal/news";
import { Header } from "@/components/server/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { WidgetSelector } from "@/components/client/widgets/widget-selector";
import { Footer } from "@uoguelph/react-components/footer";
import { HtmlParser } from "@/components/client/html-parser";
import { getMenu } from "next-drupal";
import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import { Hero, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";

export default async function OVCNewsArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getNewsArticle(id);
  const hero = content.doNotDisplayImage === false ? null : content?.heroImage;

  return (
    <Layout>
      <Header name="OVC_MAIN"></Header>

      <LayoutContent>
        {hero ? (
          <Hero
            variant="basic"
            src={content.heroImage.url}
            alt={content.heroImage.alt}
            height={content.heroImage.height}
            width={content.heroImage.width}
            priority
            as={Image}
          >
            <HeroTitle>{content.title}</HeroTitle>
          </Hero>
        ) : (
          <Typography type="h1" as="h1" className="mb-0">
            {content?.title}
          </Typography>
        )}

        <HtmlParser html={content.body.processed} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
