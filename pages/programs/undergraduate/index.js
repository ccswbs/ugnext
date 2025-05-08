import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import { getDegrees, getDegreeTypes, getPrograms, getProgramTypes } from "@/data/drupal/programs/undergraduate";
import { isDraft } from "@/lib/is-draft";

export async function getStaticProps(context) {
  const draft = isDraft(context);

  return {
    props: {
      draft: draft,
      programTypes: await getProgramTypes(),
      degreeTypes: await getDegreeTypes(),
      degrees: await getDegrees(draft),
      programs: await getPrograms(draft),
    },
  };
}

function ProgramCard({ data }) {}

export default function ProgramsUndergraduate(data) {
  return (
    <Layout metadata={{ title: "Undergraduate Programs" }}>
      <Container className="pb-0" centered>
        <Heading level={1}>Undergraduate Programs at the University of Guelph</Heading>
      </Container>

      {/*} <ProgramSearch programs={programs} types={types} /> */}

      <pre>{JSON.stringify(data, null, 4)}</pre>
    </Layout>
  );
}
