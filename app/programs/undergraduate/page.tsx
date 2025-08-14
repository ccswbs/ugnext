import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";
import { getUndergraduateDegrees, getUndergraduateDegreeTypes } from "@/data/drupal/undergraduate-degree";
import { getUndergraduatePrograms, getUndergraduateProgramTypes } from "@/data/drupal/undergraduate-program";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Undergraduate Programs",
};

export default async function ProgramsUndergraduate() {
  const degreeTypes = await getUndergraduateDegreeTypes();
  const degrees = await getUndergraduateDegrees();
  const programTypes = await getUndergraduateProgramTypes();
  const programs = await getUndergraduatePrograms();

  const combined = [...programs, ...degrees].sort((a, b) => a.title.localeCompare(b.title));
  const combinedTypes = [...programTypes, ...degreeTypes];

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Undergraduate Programs at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={combined} types={combinedTypes} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
