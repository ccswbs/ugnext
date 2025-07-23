import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { Metadata } from "next";
import SemanticSearch from "../../components/client/people/semantic-search";
import { getResearch } from "../../data/drupal/profile";

export const metadata: Metadata = {
  title: "Search Test | University of Guelph",
};

export default async function SearchTest() {
  // Fetch research areas from Drupal
  const researchAreas = await getResearch();
  const researchTopics = researchAreas.map(area => area.name);

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
      
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Search Test
          </Typography>
        </Container>

        <Container>
          <SemanticSearch topics={researchTopics} />
        </Container>

      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}