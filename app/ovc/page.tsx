import { BasicPage } from "@/components/server/basic-page";
import { getRoute } from "@/data/drupal/route";
import { notFound } from "next/navigation";
import { Container } from "@uoguelph/react-components/container";
import { OVCCards } from "@/components/client/ovc/ovc-cards";
import { OVCFeaturedNews } from "@/components/client/ovc/ovc-featured-news";
import { getFeaturedNewsArticles } from "@/data/drupal/ovc-news";
import { Metadata } from "next";
import { CustomFooter } from "@/components/server/custom-footer";

export const metadata: Metadata = {
  title: "Ontario Veterinary College",
};

export default async function OVCHome() {
  const route = await getRoute("/ovc");

  // This should never occur, but we check just to make TypeScript happy.
  if (route?.__typename !== "RouteInternal") {
    notFound();
  }

  if (route.entity?.__typename !== "NodePage") {
    notFound();
  }

  const featuredNews = await getFeaturedNewsArticles();

  return (
    <BasicPage
      id={route.entity.id}
      post={
        <>
          <Container>
            {/* @ts-ignore */}
            <OVCFeaturedNews articles={featuredNews} />
            <OVCCards />
          </Container>
                <CustomFooter units={["273"]} />
        </>
      }
    />
  );
}
