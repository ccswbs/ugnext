import { Metadata } from "next";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProfileSearch } from "@/components/client/profiles/profile-search";
import { getAllCategories } from "@/data/drupal/profile";
import { ProfileCategoryTabs } from "@/components/server/profiles/profile-category-tabs";

export const metadata: Metadata = {
  title: "Our People | University of Guelph",
};

export default async function Faculty() {
  //const tags = await getTags();
  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Our People
          </Typography>
        </Container>

        <ProfileCategoryTabs />

        <ProfileSearch />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
