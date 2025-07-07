import React from "react";
import {
  getContinuingEducationPrograms,
  getContinuingEducationProgramTypes,
} from "@/data/yaml/programs/continuing-education";
import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Typography } from "@uoguelph/react-components/typography";
import { ProgramSearch } from "@/components/client/programs/program-search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Continuing Education | University of Guelph",
};

export default async function ProgramsContinuingEducation() {
  const programs = await getContinuingEducationPrograms();
  const types = await getContinuingEducationProgramTypes();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1">
            Continuing Education at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={programs} types={types} degreeTypes={undefined} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
