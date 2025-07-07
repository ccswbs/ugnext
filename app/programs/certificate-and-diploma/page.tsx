import React from "react";
import {
  getCertificateAndDiplomaPrograms,
  getCertificateAndDiplomaProgramTypes,
} from "@/data/yaml/programs/certificate-and-diploma";
import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Typography } from "@uoguelph/react-components/typography";
import { ProgramSearch } from "@/components/client/programs/program-search";

export default async function ProgramsCertificateAndDiploma() {
  const programs = await getCertificateAndDiplomaPrograms();
  const types = await getCertificateAndDiplomaProgramTypes();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false} className="pb-0!">
        <Container className="pb-0">
          <Typography type="h1" as="h1">
            Certificate and Diplomas at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={programs} types={types} degreeTypes={undefined} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
