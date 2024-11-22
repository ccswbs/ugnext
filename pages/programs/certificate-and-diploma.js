import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { getPrograms, getProgramTypes } from "@/data/yaml/programs";
import path from "path";

export async function getStaticProps() {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "certificate-and-diploma");

  return {
    props: {
      programs: await getPrograms(directory),
      types: await getProgramTypes(directory),
    },
  };
}

export default function ProgramsCertificateAndDiploma({ programs, types }) {
  return (
    <Layout metadata={{ title: "Certificates and Diplomas" }}>
      <Container centered>
        <Heading level={1}>Certificates and Diplomas at the University of Guelph</Heading>

        <ProgramSearch programs={programs} types={types} />
      </Container>
    </Layout>
  );
}
