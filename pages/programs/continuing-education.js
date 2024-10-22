import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { getContinuingEducationPrograms } from "@/data/yaml/programs";

export async function getStaticProps() {
  return {
    props: {
      programs: await getContinuingEducationPrograms(),
    },
  };
}

export default function ProgramsContinuingEducation({ programs }) {
  return (
    <Layout metadata={{ title: "Continuing Education" }}>
      <Container centered>
        <Heading level={1}>Continuing Education at the University of Guelph</Heading>

        <ProgramSearch programs={programs} />
      </Container>
    </Layout>
  );
}
