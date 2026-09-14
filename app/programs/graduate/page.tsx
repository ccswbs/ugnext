import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";

// PHASE 1 - YAML-BASED (to be commented out during Phase 2)
// import { getGraduateDegreeTypes, getGraduateProgramTypes, getGraduatePrograms } from "@/data/yaml/programs/graduate";

// PHASE 2 - DRUPAL-BASED (also update imports in components/client/programs/program-search)
// To switch to Drupal, uncomment all the commented-out types and remove YAML-BASED imports

import { 
  getGraduateProgramDegreeTypes as getGraduateDegreeTypesDrupal, 
  getGraduateProgramSearchableTypes,
  getGraduateProgramVariants } from "@/data/drupal/graduate-program";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graduate Programs | University of Guelph",
};

export default async function ProgramsGraduate() {
  // PHASE 1 - YAML-BASED 
  // const types = await getGraduateProgramTypes();
  // const degreeTypes = await getGraduateDegreeTypes();
  // const programs = await getGraduatePrograms();

  // PHASE 2 - DRUPAL-BASED (remember to eventually switch program-search.tsx imports as well)
  const types = await getGraduateProgramSearchableTypes();
  const degreeTypes = await getGraduateDegreeTypesDrupal();
  const programs = await getGraduateProgramVariants();
  
  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Graduate Programs at the University of Guelph
          </Typography>
        </Container>

        <ProgramSearch programs={programs} types={types} degreeTypes={degreeTypes} useDegreeAcronym={true} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
