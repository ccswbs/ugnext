import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/programs/program-search";
import { getGraduateDegreeTypes, getGraduatePrograms, getGraduateProgramTypes } from "@/data/yaml/programs/graduate";

export async function getStaticProps() {
  return {
    props: {
      programs: await getGraduatePrograms(),
      types: await getGraduateProgramTypes(),
      degreeTypes: await getGraduateDegreeTypes(),
    },
  };
}

export default function ProgramsGraduate({ programs, types, degreeTypes }) {
  return (
    <>
      <Meta title="Graduate Programs" />

      <Header></Header>

      <Layout>
        <LayoutContent container={false}>
          <Container className="pb-0">
            <Typography type="h1" as="h1" className="block!">
              Graduate Programs at the University of Guelph
            </Typography>
          </Container>

          <ProgramSearch programs={programs} types={types} degreeTypes={degreeTypes} />
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
