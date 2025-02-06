import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import {
  getUndergraduateDegrees,
  getUndergraduateDegreeTypes,
  getUndergraduatePrograms,
  getUndergraduateProgramTypes,
} from "@/data/yaml/programs/undergraduate";

export async function getStaticProps() {
  const degreeTypes = await getUndergraduateDegreeTypes();
  const degrees = (await getUndergraduateDegrees()).map((degree) => ({ ...degree, types: [degree.type] }));
  const programTypes = await getUndergraduateProgramTypes();
  const programs = await getUndergraduatePrograms();

  return {
    props: {
      programs: [...programs, ...degrees]
        .map((program) => {
          return { ...program, requirements: null, "alternative-offers": null };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      types: [...programTypes, ...degreeTypes],
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
