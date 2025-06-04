import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/programs/program-search";
import {
  getContinuingEducationPrograms,
  getContinuingEducationProgramTypes,
} from "@/data/yaml/programs/continuing-education";

export async function getStaticProps() {
  return {
    props: {
      programs: await getContinuingEducationPrograms(),
      types: await getContinuingEducationProgramTypes(),
    },
  };
}

export default function ProgramsContinuingEducation({ programs, types }) {
  return (
    <>
      <Meta title="Continuing Education" />

      <Header></Header>

      <Layout>
        <LayoutContent container={false}>
          <Container className="pb-0">
            <Typography type="h1" as="h1" className="block!">
              Continuing Education at the University of Guelph
            </Typography>
          </Container>

          <ProgramSearch programs={programs} types={types} />
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
