import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { getProfiles, getProfileTypes, getUnits } from "@/data/drupal/profile";
import { ProfileSearch } from "@/components/client/profiles/profile-search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People | University of Guelph",
};

export default async function People() {
  
  const rawProfiles = await getProfiles();
  const types = await getProfileTypes();
  const units = await getUnits();
  
  // Transform profiles to match search expectations
  const profiles = rawProfiles.map((profile: any) => ({
    ...profile,
    name: profile.title, // Search expects 'name' not 'title'
    types: profile.profileType ? [profile.profileType] : [], // Convert single type to array
    units: profile.profileUnit || [], // profileUnit is already an array
    tags: profile.tags || [] // Ensure tags array exists
  }));

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
      
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Our People
          </Typography>
        </Container>
        
        <ProfileSearch profiles={profiles} types={types} units={units} />

      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
