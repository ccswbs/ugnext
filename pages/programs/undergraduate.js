import React from 'react';
import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { ProgramSearch } from '@/components/programs/search';
import { toTitleCase } from '@/lib/string-utils';
import { Card } from '@/components/card';
import { getUndergraduatePrograms } from '@/data/yaml/programs';

export async function getStaticProps() {
  return {
    props: {
      programs: await getUndergraduatePrograms(),
    },
  };
}

export default function ProgramsUndergraduate({ programs }) {
  return (
    <Layout title="Undergraduate Programs">
      <Container centered>
        <Heading level={1}>Undergraduate Programs at the University of Guelph</Heading>

        <ProgramSearch
          programs={programs}
          render={(program) => (
            <Card
              href={program.url}
              key={program.name + program.url}
              title={
                <div className="flex flex-col justify-center">
                  <span className="text-lg font-bold">{program.name}</span>
                  {program?.degrees?.map((degree, index) => (
                    <span key={index} className="text-sm text-black/65">
                      {degree}
                    </span>
                  ))}
                </div>
              }
              footer={
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {program?.types?.map((type) => toTitleCase(type)).join(', ')}
                </span>
              }
            />
          )}
        />
      </Container>
    </Layout>
  );
}
