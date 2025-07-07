import React from "react";
import { Container } from "@uoguelph/react-components/container";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
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
    <>
      <Meta title="Certificates and Diplomas" />

      <Header></Header>

      <Layout>
        <LayoutContent container={false}>
          <Container>
            <Typography type="h1" as="h1" className="block!">
              Certificates and Diplomas at the University of Guelph
            </Typography>
          </Container>

          <ProgramSearch programs={programs} types={types} />
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
