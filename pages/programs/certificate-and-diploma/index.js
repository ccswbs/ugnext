import React from "react";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";
import { Heading } from "@/components/heading";
import { ProgramSearch } from "@/components/programs/program-search";
import {
  getCertificateAndDiplomaPrograms,
  getCertificateAndDiplomaProgramTypes,
} from "@/data/yaml/programs/certificate-and-diploma";

export async function getStaticProps() {
  return {
    props: {
      programs: await getCertificateAndDiplomaPrograms(),
      types: await getCertificateAndDiplomaProgramTypes(),
    },
  };
}

export default function ProgramsCertificateAndDiploma({ programs, types }) {
  return (
    <Layout metadata={{ title: "Certificates and Diplomas" }}>
      <Container centered>
        <Heading level={1}>Certificates and Diplomas at the University of Guelph</Heading>
      </Container>

      <ProgramSearch programs={programs} types={types} />
    </Layout>
  );
}
