import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { getProfileCount } from "@/data/drupal/profile";
import ProfilesList from "@/components/client/profiles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "People | University of Guelph",
};

export default async function People() {
  
  const profileCount = getProfileCount();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            People at the University of Guelph
          </Typography>
          <p>There are {profileCount} profiles total</p>
          
          <ProfilesList profileType="Faculty" />

        </Container>        
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
