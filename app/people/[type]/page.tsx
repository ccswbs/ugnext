import { Metadata, ResolvingMetadata } from "next";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProfileSearch } from "@/components/client/profiles/profile-search";
import { getRoute } from "@/data/drupal/route";
import { notFound } from "next/navigation";
import { ProfileTabs } from "@/components/server/profiles/profile-tabs";

type Props = {
  params: Promise<{ type: string }>;
};

async function getType(type: string) {
  const route = await getRoute(`/term/profiles/types/${type}`);

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

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const type = await getType((await params).type);

  if (!type) {
    notFound();
  }

  return {
    title: `${type.name}`,
  };
}

export default async function PeopleByCategory({ params }: Props) {
  const type = await getType((await params).type);

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

        <ProfileTabs />

        <ProfileSearch />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
