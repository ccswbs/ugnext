import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { getDegrees, getDegreeTypes, getPrograms, getProgramTypes } from "@/data/yaml/programs";
import path from "path";

export async function getStaticProps() {
  const directory = path.join(process.cwd(), "data", "yaml", "programs", "undergraduate");
  const programs = await getPrograms(directory);
  const types = await getProgramTypes(directory);
  const degrees = await getDegrees(directory);
  const degreesTypes = await getDegreeTypes(directory);

  return {
    props: {
      programs: [...programs, ...degrees.map((degree) => ({ ...degree, types: [degree.type] }))].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      types: [...types, ...degreesTypes],
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
