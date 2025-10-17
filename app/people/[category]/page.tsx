import { Metadata, ResolvingMetadata } from "next";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProfileSearch } from "@/components/client/profiles/profile-search";
import { getAllCategories } from "@/data/drupal/profile";
import { getRoute } from "@/data/drupal/route";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string }>;
};

async function getCategory(category: string) {
  const route = await getRoute(`/term/profiles/categories/${category}`);

  if (!route) {
    return null;
  }

  if (route.__typename !== "RouteInternal") {
    return null;
  }

  if (!route.entity) {
    return null;
  }

  if (route.entity.__typename !== "TermProfileCategory") {
    return null;
  }

  return route.entity;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const category = await getCategory((await params).category);

  if (!category) {
    notFound();
  }

  return {
    title: `Our ${category.name}`,
  };
}

export default async function PeopleByCategory({ params }: Props) {
  const category = await getCategory((await params).category);

  if (!category) {
    notFound();
  }

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Our {category.name}
          </Typography>
        </Container>

        <ProfileSearch />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
