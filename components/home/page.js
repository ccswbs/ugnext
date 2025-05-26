import { twJoin } from "tailwind-merge";
import AppArmor from "@/components/app-armor";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { TagLine } from "@/components/home/tag-line";
import { SpotlightHero } from "@/components/home/spotlight-hero";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { SpotlightCards } from "@/components/home/spotlight-cards";
import { StudyHere } from "@/components/home/study-here";
import { Rankings } from "@/components/home/rankings";
import { ThreeCampuses } from "@/components/home/three-campuses";
import { HomeStory } from "@/components/home/story";
import { Footer } from "@uoguelph/react-components/footer";
import { Meta } from "@/components/meta";

export function HomePage({ cards, hero, loading, appArmorTest = false }) {
  const containerClasses = twJoin("pt-6");

  return (
    <>
      <Meta></Meta>

      <AppArmor test={appArmorTest} />

      <Header></Header>

      <Layout>
        <LayoutContent container={false}>
          <div className="flex flex-col-reverse">
            <TagLine />
            {hero && <SpotlightHero data={hero} />}
          </div>

          <Container>
            <Typography className="text-black!" type="h2" as="h2">
              Our Latest News and Events
            </Typography>
            <SpotlightCards cards={cards} />
          </Container>

          <Container className={containerClasses}>
            <Typography className="text-black!" type="h2" as="h2">
              Study Here
            </Typography>
            <StudyHere />
          </Container>

          <Container className={containerClasses}>
            <Typography className="text-black!" type="h2" as="h2">
              How We Rank Among the World
            </Typography>
            <Rankings />
          </Container>

          <Container className={containerClasses}>
            <Typography className="text-black!" type="h2" as="h2">
              Our Three Campuses
            </Typography>
            <ThreeCampuses />
          </Container>

          <HomeStory />
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
