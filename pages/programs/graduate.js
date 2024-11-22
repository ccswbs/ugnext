import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import path from "path";
import { getDegreeTypes, getPrograms, getProgramTypes } from "@/data/yaml/programs";

export async function getStaticProps() {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "graduate");

  return {
    props: {
      programs: await getPrograms(directory),
      types: await getProgramTypes(directory),
      degreeTypes: await getDegreeTypes(directory),
    },
  };
}

export default function ProgramsGraduate({ programs, types, degreeTypes }) {
  return (
    <Layout metadata={{ title: "Graduate Programs" }}>
      <Container centered>
        <Heading level={1}>Graduate Programs at the University of Guelph</Heading>

        <ProgramSearch programs={programs} types={types} degreeTypes={degreeTypes} />
      </Container>
    </Layout>
  );
}
