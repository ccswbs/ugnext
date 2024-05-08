import React from "react";
import { Container } from "@/components/container";
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';

export default function ProgramsContinuingEducation({ data, children }) {
  return (
    <Layout>
      <Container centered>
        <Heading level={1}>Continuing Education at the University of Guelph</Heading>
      </Container>
    </Layout>
  );
}
