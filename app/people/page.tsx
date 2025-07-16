import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { getProfiles, getProfileCount, getProfileTypes, getUnits } from "@/data/drupal/profile";
//import ProfilesList from "@/components/client/profiles";
import { PeopleSearch } from "@/components/client/people/people-search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People | University of Guelph",
};

export default async function People() {
  
  const profiles = await getProfiles();
  const types = await getProfileTypes();
  //const types = ["Faculty","Graduate Student"];
  const units = await getUnits();
  
  const profileCount = getProfileCount();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Our People
          </Typography>
          <p>There are {profileCount} profiles total</p>
          
          <PeopleSearch profiles={profiles} types={types} units={units} />

        </Container>        
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
