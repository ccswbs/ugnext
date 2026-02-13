import { Metadata } from "next";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import React from "react";
import { NewsSearch } from "@/components/client/news/news-search";
import { Container } from "@uoguelph/react-components/container";

export const metadata: Metadata = {
  title: "News",
};

export default async function NewsHome() {
  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            University of Guelph News
          </Typography>
        </Container>

        <NewsSearch />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
