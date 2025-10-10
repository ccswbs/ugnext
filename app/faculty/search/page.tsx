import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { FacultySearch } from "@/components/client/profiles/faculty-search";
import { getUnits } from "@/data/drupal/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty | University of Guelph",
};

export default async function Faculty() {
  //const tags = await getTags();
  const units = await getUnits();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
      
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Faculty Directory
          </Typography>
        </Container>

        <FacultySearch units={units} />

      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}