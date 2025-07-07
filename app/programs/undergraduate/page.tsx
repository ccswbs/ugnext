import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";
import {
  getUndergraduateDegrees,
  getUndergraduateDegreeTypes,
  getUndergraduatePrograms,
  getUndergraduateProgramTypes,
} from "@/data/yaml/programs/undergraduate";

export default async function ProgramsUndergraduate() {
  const degreeTypes = await getUndergraduateDegreeTypes();
  const degrees = (await getUndergraduateDegrees()).map((degree: { type: any }) => ({
    ...degree,
    types: [degree.type],
  }));
  const programTypes = await getUndergraduateProgramTypes();
  const programs = await getUndergraduatePrograms();

  const combined = [...programs, ...degrees]
    .map((program) => {
      return { ...program, requirements: null, "alternative-offers": null };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const combinedTypes = [...programTypes, ...degreeTypes];

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container className="pb-0">
          <Typography type="h1" as="h1" className="block!">
            Undergraduate Programs at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={combined} types={combinedTypes} degreeTypes={undefined} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
