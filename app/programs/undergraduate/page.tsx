import { Container } from "@uoguelph/react-components/container";
import { Layout } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { LayoutContent } from "@uoguelph/react-components/layout";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProgramSearch } from "@/components/client/programs/program-search";
import { getUndergraduateDegrees, getUndergraduateDegreeTypes } from "@/data/drupal/undergraduate-degree";
import { getUndergraduatePrograms, getUndergraduateProgramTypes } from "@/data/drupal/undergraduate-program";
import { Metadata } from "next";
/*
import { Card, CardContent, CardFooter, CardTitle } from "@uoguelph/react-components/card";
import { UndergraduateDegreeFragment, UndergraduateProgramFragment } from "@/lib/graphql/types";

type CombinedUndergraduateProgram = UndergraduateProgramFragment | UndergraduateDegreeFragment

const ProgramCard = ({ program }: { program: CombinedUndergraduateProgram }) => {
  if(!program.url.url) {

  }

  return (
    <Card as="a" key={program.id} href={program.url.url} className="h-full hover:scale-105 transition-transform">
      <CardContent className="flex-1 flex justify-center">
        <CardTitle>{program.name}</CardTitle>

        {program.degree && <span className="text-black/65">{program.degree.name}</span>}

        {program.degrees && (
          <span className="text-black/65">
            {program.degrees?.map((degree) => degree.acronym ?? degree.name).join(", ")}
          </span>
        )}
      </CardContent>

      <CardFooter>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {program?.types?.map((type) => type.name).join(", ")}
        </span>
      </CardFooter>
    </Card>
  );
};
*/

export const metadata: Metadata = {
  title: "Undergraduate Programs | University of Guelph",
};

export default async function ProgramsUndergraduate() {
  const degreeTypes = await getUndergraduateDegreeTypes();
  const degrees = await getUndergraduateDegrees();
  const programTypes = await getUndergraduateProgramTypes();
  const programs = await getUndergraduatePrograms();

  const combined = [...programs, ...degrees].sort((a, b) => a.title.localeCompare(b.title));
  const combinedTypes = [...programTypes, ...degreeTypes];

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Undergraduate Programs at the University of Guelph
          </Typography>
        </Container>

        {JSON.stringify(combined)}
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
