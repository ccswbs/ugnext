import { getNewsArticle } from "@/data/drupal/ovc-news";
import { Header } from "@/components/server/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { HtmlParser } from "@/components/client/html-parser";
import { Hero, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Typography } from "@uoguelph/react-components/typography";
import { notFound } from "next/navigation";
import { Container } from "@uoguelph/react-components/container";
import { Metadata, ResolvingMetadata } from "next";
import { getRoute } from "@/data/drupal/route";
import { OVCFooter } from "@/components/client/ovc/ovc-footer";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const route = await getRoute(`/node/${id}`);

  if (route && route.__typename === "RouteInternal" && route?.entity && "title" in route.entity) {
    return {
      title: route.entity.title,
    };
  }

  return {};
}

export default async function OVCNewsArticle({ params }: Props) {
  const { id } = await params;
  const content = await getNewsArticle(id);

  if (!content) {
    notFound();
  }

  const date = new Date(content.created.time);

  return (
    <Layout>
      <Header name="OVC_MAIN"></Header>

      <LayoutContent container={false}>
        {content.heroImage && !content.doNotDisplayImage ? (
          <Hero
            variant="basic"
            src={content.heroImage.image.url}
            alt={content.heroImage.image.alt ?? ""}
            height={content.heroImage.image.height}
            width={content.heroImage.image.width}
            priority
            as={Image}
          >
            <HeroTitle>{content.title}</HeroTitle>
          </Hero>
        ) : (
          <Container>
            <Typography type="h1" as="h1" className="mb-0">
              {content?.title}
            </Typography>
          </Container>
        )}

        <Container className="pt-4">
          <Typography type="body">
            Posted on{" "}
            {date.toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
          </Typography>

          <div className="py-4">
            <HtmlParser key={content.id} html={content.body?.processed} instructions={undefined} />
          </div>
        </Container>
      </LayoutContent>

      <OVCFooter />
      <Footer></Footer>
    </Layout>
  );
}
