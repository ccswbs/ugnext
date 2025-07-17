import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { FacultySearch } from "@/components/client/people/faculty-search";
import { getProfilesByType, getUnits } from "@/data/drupal/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty | University of Guelph",
};

export default async function Faculty() {
    const rawProfiles = await getProfilesByType("Faculty");
  //const types = await getProfileTypes();
  const units = await getUnits();
  
  // Transform profiles to match search expectations
  const profiles = rawProfiles.map((profile: any) => ({
    ...profile,
    name: profile.title, // Search expects 'name' not 'title'
    units: profile.profileUnit || [], // profileUnit is already an array
    tags: profile.tags || [] // Ensure tags array exists
  }));

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
      
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Faculty Directory
          </Typography>
        </Container>
        
        <FacultySearch profiles={profiles} units={units} />

      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}