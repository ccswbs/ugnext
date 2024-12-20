import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/search";
import { getCertificateAndDiplomaPrograms } from "@/data/yaml/programs";

export async function getStaticProps() {
  return {
    props: {
      programs: await getCertificateAndDiplomaPrograms(),
    },
  };
}

export default function ProgramsCertificateAndDiploma({ programs }) {
  return (
    <Layout metadata={{ title: "Certificates and Diplomas" }}>
      <Container centered>
        <Heading level={1}>Certificates and Diplomas at the University of Guelph</Heading>

        <ProgramSearch programs={programs} />
      </Container>
    </Layout>
  );
}
