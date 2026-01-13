import { Header } from "@/components/server/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { OvcNewsGrid } from "@/components/client/ovc/news/ovc-news-grid";
import { Typography } from "@uoguelph/react-components/typography";
import { Container } from "@uoguelph/react-components/container";
import { Metadata } from "next";
import { CustomFooter } from "@/components/server/custom-footer";

export const metadata: Metadata = {
  title: "Ontario Veterinary College News Hub",
};

export default async function OVCNewsHub() {
  return (
    <Layout>
      <Header name="OVC_MAIN"></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography as="h1" type="h1">
            Ontario Veterinary College News Hub
          </Typography>
        </Container>

        <OvcNewsGrid />
      </LayoutContent>

      <CustomFooter units={["273"]} />
      <Footer></Footer>
    </Layout>
  );
}
