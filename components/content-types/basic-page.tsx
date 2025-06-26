import { InternalRouteBreadcrumbs } from "@/data/drupal/route";
import { Header } from "@uoguelph/react-components/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import { getPageContent } from "@/data/drupal/fragments/basic-page";
import { notFound } from "next/navigation";

export type BasicPageProps = {
  id: string;
  title: string;
  breadcrumbs: InternalRouteBreadcrumbs;
};

export async function BasicPage({ id, title, breadcrumbs }: BasicPageProps) {
  const content = await getPageContent(id);

  if (content === null) {
    notFound();
  }

  console.log(content);

  return (
    <Layout>
      <Header></Header>

      {breadcrumbs && (
        <Breadcrumbs>
          <BreadcrumbHome href="/" />

          {breadcrumbs
            .filter((breadcrumb) => breadcrumb.url && breadcrumb.title && breadcrumb.title !== "Home")
            .map((breadcrumb) => (
              <Breadcrumb key={breadcrumb.url} href={breadcrumb.url as string}>
                {breadcrumb.title}
              </Breadcrumb>
            ))}

          <Breadcrumb>{title}</Breadcrumb>
        </Breadcrumbs>
      )}

      <LayoutContent></LayoutContent>

      <Footer></Footer>
    </Layout>
  );
}
