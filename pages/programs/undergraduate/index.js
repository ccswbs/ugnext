import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Meta } from "@/components/meta";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/programs/program-search";
import {
  getUndergraduateDegrees,
  getUndergraduateDegreeTypes,
  getUndergraduatePrograms,
  getUndergraduateProgramTypes,
} from "@/data/yaml/programs/undergraduate";

export async function getStaticProps() {
  const degreeTypes = await getUndergraduateDegreeTypes();
  const degrees = (await getUndergraduateDegrees()).map((degree) => ({ ...degree, types: [degree.type] }));
  const programTypes = await getUndergraduateProgramTypes();
  const programs = await getUndergraduatePrograms();

  return {
    props: {
      programs: [...programs, ...degrees]
        .map((program) => {
          return { ...program, requirements: null, "alternative-offers": null };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      types: [...programTypes, ...degreeTypes],
    },
  };
}

export default function ProgramsUndergraduate({ programs, types }) {
  return (
    <>
      <Meta title="Undergraduate Programs" />

      <Header></Header>

      <Layout>
        <LayoutContent container={false}>
          <Container className="pb-0">
            <Typography type="h1" as="h1" className="block!">
              Undergraduate Programs at the University of Guelph
            </Typography>
          </Container>

          <ProgramSearch programs={programs} types={types} />
        </LayoutContent>
      </Layout>

      <Footer></Footer>
    </>
  );
}
