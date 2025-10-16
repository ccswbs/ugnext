import { Metadata } from "next";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Header } from "@uoguelph/react-components/header";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { Footer } from "@uoguelph/react-components/footer";
import { ProfileSearchGrid } from "@/components/client/profiles/profile-search-grid";

export const metadata: Metadata = {
  title: "Faculty | University of Guelph",
};

export default async function Faculty() {
  //const tags = await getTags();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent container={false}>
        <Container>
          <Typography type="h1" as="h1" className="block!">
            Faculty Directory
          </Typography>
        </Container>

        <ProfileSearchGrid />
      </LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
