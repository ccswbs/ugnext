import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { getPrograms, getProgramTypes } from "@/data/yaml/programs";
import path from "path";

export async function getStaticProps() {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");

  return {
    props: {
      programs: await getPrograms(directory),
      types: await getProgramTypes(directory),
    },
  };
}

export default function UndergraduateAdmissionRequirements({studentTypes, locations, programs }) {
  return (
    <Layout metadata={{ title: "Undergraduate Admission Requirements" }}>
      <Container centered>
        <Heading level={1}>Undergraduate Admission Requirements</Heading>


      </Container>
    </Layout>
  );
}
