import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";
import { getGraduateDegreeTypes, getGraduatePrograms, getGraduateProgramTypes } from "@/data/yaml/programs/graduate";

export default async function ProgramsGraduate() {
  const programs = await getGraduatePrograms();
  const types = await getGraduateProgramTypes();
  const degreeTypes = await getGraduateDegreeTypes();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container className="pb-0">
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
