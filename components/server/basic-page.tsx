import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Header } from "@/components/server/header";
import { getPageContent } from "@/data/drupal/basic-page";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/server/breadcrumbs";

export type BasicPageProps = {
  id: string;
};

export async function BasicPage({ id }: BasicPageProps) {
  const content = await getPageContent(id);

  // Couldn't fetch content for this id.
  if (!content) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Couldn't find content for basic page with id ${id}`);

      if (process.env.ALWAYS_SHOW_PUBLISHED_CONTENT) {
        console.warn("It's possible this page is not published. ALWAYS_SHOW_PUBLISHED_CONTENT is set to true.");
      }
    }

    notFound();
  }

  return (
    <Layout>
      <Header name={content.primaryNavigation?.menuName?.toUpperCase().replaceAll("-", "_")}></Header>
      <Breadcrumbs url={content.path ?? undefined} />

      <LayoutContent></LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
