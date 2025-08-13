import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";
import { getGraduateDegreeTypes, getGraduateProgramTypes, getGraduatePrograms } from "@/data/yaml/programs/graduate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graduate Programs | University of Guelph",
};

export default async function ProgramsGraduate() {
  const types = await getGraduateProgramTypes();
  const degreeTypes = await getGraduateDegreeTypes();
  const programs = await getGraduatePrograms();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Graduate Programs at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={programs} types={types} degreeTypes={degreeTypes} useDegreeAcronym={true} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
