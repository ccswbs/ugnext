import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import {
  getContinuingEducationPrograms,
  getContinuingEducationProgramTypes,
} from "@/data/yaml/programs/continuing-education";

export async function getStaticProps() {
  return {
    props: {
      programs: await getContinuingEducationPrograms(),
      types: await getContinuingEducationProgramTypes(),
    },
  };
}

export default function ProgramsContinuingEducation({ programs, types }) {
  return (
    <Layout metadata={{ title: "Continuing Education" }}>
      <Container centered>
        <Heading level={1}>Continuing Education at the University of Guelph</Heading>

        <ProgramSearch programs={programs} types={types} />
      </Container>
    </Layout>
  );
}
