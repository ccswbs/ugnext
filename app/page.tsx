import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";

export default async function Page() {
  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <h1>Page</h1>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
