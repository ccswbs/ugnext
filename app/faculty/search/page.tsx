import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { FacultySearch } from "@/components/client/people/faculty-search";
import { getProfilesByType, getResearch, getUnits } from "@/data/drupal/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty | University of Guelph",
};

export default async function Faculty() {
  const rawProfiles = await getProfilesByType("Faculty");
  const research = await getResearch();
  //const tags = await getTags();
  const units = await getUnits();
  
  // Transform profiles to match search expectations
  const profiles = rawProfiles.map((profile: any) => ({
    ...profile,
    name: profile.title, // Search expects 'name' not 'title'
    units: profile.profileUnit || [], // profileUnit is already an array
    research: profile.profileResearchAreas || [], // Ensure research array exists
    //tags: profile.tags || []  Ensure tags array exists
  }));

  // Extract research topic names for semantic search
  const researchTopics = research?.map((item: any) => item.name).filter(Boolean) || [];

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
      
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Faculty Directory
          </Typography>
        </Container>

        <FacultySearch profiles={profiles} units={units} researchTopics={researchTopics} />

      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}