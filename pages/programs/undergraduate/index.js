import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import { getUndergraduatePrograms, getUndergraduateProgramTypes } from "@/data/yaml/programs/undergraduate";

export async function getStaticProps() {
  return {
    props: {
      programs: (await getUndergraduatePrograms()).map((program) => {
        // Remove admission data as we don't need it for the search
        delete program.admission;
        return program;
      }),
      types: await getUndergraduateProgramTypes(),
    },
  };
}

export default function ProgramsUndergraduate({ programs, types }) {
  return (
    <Layout metadata={{ title: "Undergraduate Programs" }}>
      <Container centered>
        <Heading level={1}>Undergraduate Programs at the University of Guelph</Heading>

        <ProgramSearch programs={programs} types={types} />
      </Container>
    </Layout>
  );
}
