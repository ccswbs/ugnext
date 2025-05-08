import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import { getDegrees, getDegreeTypes, getPrograms, getProgramTypes } from "@/data/drupal/programs/undergraduate";
import { isDraft } from "@/lib/is-draft";

export async function getStaticProps(context) {
  const draft = isDraft(context);

  // We process the data from Drupal to match what we had when using YAML, this is just temporary, at some point we should refactor the program search components
  const degreeTypes = (await getDegreeTypes()).map((type) => ({
    id: type,
    name: type,
  }));

  const degrees = (await getDegrees(draft)).map((degree) => {
    const value = {
      ...degree,
      types: [
        {
          id: degree.type,
          name: degree.type,
        },
      ],
    };

    delete value.type;

    return value;
  });

  const programTypes = (await getProgramTypes()).map((type) => ({
    id: type,
    name: type,
  }));

  const programs = (await getPrograms(draft)).map((program) => {
    const value = {
      ...program,
      degree: {
        name: program.degree,
      },
      types: program.type.map((type) => ({
        id: type,
        name: type,
      })),
    };

    delete value.type;

    return value;
  });

  return {
    props: {
      draft: draft,
      programs: [...programs, ...degrees],
      types: [...programTypes, ...degreeTypes],
    },
  };
}

function ProgramCard({ data }) {}

export default function ProgramsUndergraduate({ programs, types }) {
  return (
    <Layout metadata={{ title: "Undergraduate Programs" }}>
      <Container className="pb-0" centered>
        <Heading level={1}>Undergraduate Programs at the University of Guelph</Heading>
      </Container>

      <ProgramSearch programs={programs ?? []} types={types ?? []} />
    </Layout>
  );
}
