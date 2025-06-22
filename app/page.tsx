import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Footer } from "@uoguelph/react-components/footer";
import { getSpotlightHero } from "@/data/drupal/home";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { TagLine } from "@/components/home/tag-line";

export default async function Page() {
  const hero = await getSpotlightHero();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <div className="flex flex-col-reverse">
          <TagLine />
          {hero && <SpotlightHero data={hero} />}
        </div>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
