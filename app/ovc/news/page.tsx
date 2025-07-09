import { Header } from "@/components/server/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { OVCFooter } from "@/components/client/ovc/ovc-footer";
import { OvcNewsGrid } from "@/components/client/ovc/news/ovc-news-grid";
import { getNewsArticleCount } from "@/data/drupal/ovc-news";
import { Typography } from "@uoguelph/react-components/typography";
import { Container } from "@uoguelph/react-components/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ontario Veterinary College News Hub",
};

export default async function OVCNewsHub() {
  const articleCount = await getNewsArticleCount();
  const displayCount = 20;
  const totalPages = Math.ceil(articleCount / displayCount);

  return (
    <Layout>
      <Header name="OVC_MAIN"></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography as="h1" type="h1">
            Ontario Veterinary College News Hub
          </Typography>
        </Container>

        <OvcNewsGrid totalPages={totalPages} />
      </LayoutContent>

      <OVCFooter />
      <Footer></Footer>
    </Layout>
  );
}
