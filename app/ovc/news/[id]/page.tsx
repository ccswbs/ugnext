import { getNewsArticle } from "@/data/drupal/news";
import { Header } from "@/components/server/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { HtmlParser } from "@/components/client/html-parser";
import { Hero, HeroTitle } from "@uoguelph/react-components/hero";
import Image from "next/image";
import { Typography } from "@uoguelph/react-components/typography";
import { notFound } from "next/navigation";

export default async function OVCNewsArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getNewsArticle(id);

  if (!content) {
    notFound();
  }

  const hero = content.doNotDisplayImage === false ? null : content?.heroImage;
  const date = new Date(content.created.time);

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

        <Typography type="body">
          {date.toLocaleString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </Typography>

        <div className="py-4">
          <HtmlParser key={content.id} html={content.body.processed} />
        </div>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
