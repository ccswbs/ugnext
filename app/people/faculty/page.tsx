import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import FacultyList from "@/components/client/faculty";
import { getProfilesByType } from "@/data/drupal/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty | University of Guelph",
};

export default async function People() {
  const profiles = await getProfilesByType("Faculty"); // Server-side fetch

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Faculty Directory
          </Typography>

          <FacultyList profiles={profiles} />
        </Container>
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}