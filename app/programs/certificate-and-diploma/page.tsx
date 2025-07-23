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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate and Diplomas | University of Guelph",
};

export default async function ProgramsCertificateAndDiploma() {
  const programs = await getCertificateAndDiplomaPrograms();
  const types = await getCertificateAndDiplomaProgramTypes();

  console.log(types, programs);

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1">
            Certificate and Diplomas at the University of Guelph
          </Typography>
        </Container>

      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
