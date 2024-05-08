import React from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';

export async function getStaticProps() {
  const path = join(process.cwd(), 'data', 'programs', 'continuing-education.yml');
  const programs = await readYamlFile(path);

  return {
    props: {
      programs: programs,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export default function ProgramsContinuingEducation({ programs }) {
  return (
    <Layout>
      <Container centered>
        <Heading level={1}>Continuing Education at the University of Guelph</Heading>

        <ProgramSearch programs={programs} />
      </Container>
    </Layout>
  );
}
