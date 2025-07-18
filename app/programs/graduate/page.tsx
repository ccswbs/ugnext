import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { getAIOProgramListData, AIO } from "@/components/server/aio";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";
import { getGraduateDegreeTypes, getGraduatePrograms, getGraduateProgramTypes } from "@/data/yaml/programs/graduate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graduate Programs | University of Guelph",
};

export default async function ProgramsGraduate() {
  const programs = await getGraduatePrograms();
  const types = await getGraduateProgramTypes();
  const degreeTypes = await getGraduateDegreeTypes();
  const jsonLD = getAIOProgramListData(programs);

  return (
    <Layout>
      <AIO jsonLD={jsonLD}></AIO>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Graduate Programs at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={programs} types={types} degreeTypes={degreeTypes} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
