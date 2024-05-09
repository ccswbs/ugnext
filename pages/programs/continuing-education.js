import React from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { join } from 'path';
import { readYamlFile } from '@/lib/file-utils';
import { ProgramSearch } from '@/components/programs/search';
import { ProgramNavigation } from '@/components/programs/navigation';

export async function getStaticProps() {
  const path = join(process.cwd(), 'data', 'programs', 'continuing-education.yml');
  const programs = await readYamlFile(path);

  return {
    props: {
      programs: programs,
    },
  };
}

export default function ProgramsContinuingEducation({ programs }) {
  return (
    <Layout title="Continuing Education">
      <Container centered>
        <Heading level={1}>Continuing Education at the University of Guelph</Heading>

        <ProgramNavigation />

        <ProgramSearch programs={programs} />
      </Container>
    </Layout>
  );
}
