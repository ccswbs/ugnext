import { BasicPage } from "@/components/server/basic-page";
import { getRoute } from "@/data/drupal/route";
import { notFound } from "next/navigation";
import { Container } from "@uoguelph/react-components/container";
import { OVCCards } from "@/components/client/ovc/ovc-cards";
import { OVCFeaturedNews } from "@/components/client/ovc/ovc-featured-news";
import { getFeaturedLegacyNewsArticles } from "@/data/drupal/legacy-news";
import { Metadata } from "next";
import { CustomFooter } from "@/components/server/custom-footer";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { TagLine } from "@/components/client/home/tag-line";
import { SpotlightHero } from "@/components/client/home/spotlight-hero";
import { Typography } from "@uoguelph/react-components/typography";
import { SpotlightCards } from "@/components/client/home/spotlight-cards";
import { StudyHere } from "@/components/client/home/study-here";
import { Rankings } from "@/components/client/home/rankings";
import { ThreeCampuses } from "@/components/client/home/three-campuses";
import { HomeStory } from "@/components/client/home/story";
import { Footer } from "@uoguelph/react-components/footer";
import React from "react";

export const metadata: Metadata = {
  title: "News",
};

export default async function NewsHome() {
  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
        <Typography type="h1" as="h1" className="block!">
          University of Guelph News
        </Typography>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
