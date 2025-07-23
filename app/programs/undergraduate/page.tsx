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

import { Card, CardContent, CardFooter, CardTitle } from "@uoguelph/react-components/card";
import { UndergraduateDegreeFragment, UndergraduateProgramFragment } from "@/lib/graphql/types";
import { tv } from "tailwind-variants";

type CombinedUndergraduateProgram = UndergraduateProgramFragment | UndergraduateDegreeFragment;

const ProgramCard = ({ program }: { program: CombinedUndergraduateProgram }) => {
  const url = program.url.url;

  const styles = tv({
    slots: {
      card: "h-full hover:scale-105 transition-transform",
      content: "flex-1 flex justify-center",
      degree: "text-black/65",
      footer: "overflow-hidden text-ellipsis whitespace-nowrap",
    },
  })();

  return (
    <Card as={url ? "a" : "div"} key={program.id} href={url ? url : undefined} className={styles.card()}>
      <CardContent className={styles.content()}>
        <CardTitle>{program.title}</CardTitle>

        {program.__typename === "NodeUndergraduateProgram" && program.degree && (
          <span className="text-black/65">{program.degree.title}</span>
        )}
      </CardContent>

      <CardFooter>
        <span className={styles.footer()}>
          {Array.isArray(program.type) ? program.type.map((type) => type.name).join(", ") : program.type.name}
        </span>
      </CardFooter>
    </Card>
  );
};

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

        <ProgramSearch programs={combined} types={combinedTypes} />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
