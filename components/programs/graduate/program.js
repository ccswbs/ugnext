import { Layout } from '@/components/layout';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { twJoin } from 'tailwind-merge';
import { GraduateProgramHero } from '@/components/programs/graduate/hero';

export const GraduateProgramPage = ({ data, isFallback }) => (
  <Layout title="Graduate Programs">
    <GraduateProgramHero />
    <Container className={twJoin(isFallback && 'hidden')} centered>
      <Heading level={1}>{data?.program}</Heading>
    </Container>
  </Layout>
);
