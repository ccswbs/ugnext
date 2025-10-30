import { Metadata } from "next";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { FacultySearch } from "@/components/client/profiles/faculty-search";
import { getRoute } from "@/data/drupal/route";
import { getAllUnits } from "@/data/drupal/profile";
import { notFound } from "next/navigation";

async function getFacultyType() {
  const route = await getRoute(`/term/profiles/types/faculty`);

  if (!route) {
    return null;
  }

  if (route.__typename !== "RouteInternal") {
    return null;
  }

  if (!route.entity) {
    return null;
  }

  if (route.entity.__typename !== "TermProfileType") {
    return null;
  }

  return route.entity;
}

export async function generateMetadata(): Promise<Metadata> {
  const type = await getFacultyType();

  if (!type) {
    notFound();
  }

  return {
    title: `${type.name}`,
  };
}

export default async function FacultySearchPage() {
  const type = await getFacultyType();
  const units = await getAllUnits();

  if (!type) {
    notFound();
  }

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            {type.name} at the University of Guelph
          </Typography>
        </Container>

        <FacultySearch
          queryByName={{
            enabled: true,
          }}
          queryByResearchArea={{
            enabled: true,
          }}
          queryByUnit={{
            enabled: true,
          }}
          units={{
            enabled: false,
          }}
          availableUnits={units}
          facultyTypeId={type.id}
          isAcceptingGraduateStudents={{
            enabled: false,
          }}
        />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}