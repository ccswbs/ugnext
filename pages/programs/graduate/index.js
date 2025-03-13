import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
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
    <Layout metadata={{ title: "Graduate Programs" }}>
      <Container centered>
        <Heading level={1}>Graduate Programs at the University of Guelph</Heading>
      </Container>

      <ProgramSearch programs={programs} types={types} degreeTypes={degreeTypes} />
    </Layout>
  );
}
