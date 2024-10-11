import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { toTitleCase } from "@/lib/string-utils";
import { Card } from "@/components/card";
import { getPrograms } from "@/data/yaml/programs/undergraduate";

export async function getStaticProps() {
  return {
    props: {
      programs: await getPrograms(),
    },
  };
}

export default function ProgramsUndergraduate({ programs }) {
  return (
    <Layout title="Undergraduate Programs">
      <Container centered>
        <Heading level={1}>Undergraduate Programs at the University of Guelph</Heading>

        <ProgramSearch programs={programs} />
      </Container>
    </Layout>
  );
}
