import { notFound } from "next/navigation";
import { getRoute } from "@/data/drupal/route";
import { News } from "@/components/server/news";
import { getUnitBySlugifiedName } from "@/data/drupal/taxonomy";
import { Header } from "@/components/server/header";
import React from "react";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { Typography } from "@uoguelph/react-components/typography";
import { CustomFooter } from "@/components/server/custom-footer";
import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NewsArticle({ params }: Props) {
  const { slug: unitName } = await params;

  const unit = await getUnitBySlugifiedName(unitName);

  if (!unit) notFound();

  return (
    <Layout>
      <Header></Header>

      <LayoutContent>
        <Breadcrumbs>
          <BreadcrumbHome />
          <Breadcrumb as={"span"}>{unit.name}</Breadcrumb>
        </Breadcrumbs>

        <Typography type="h1" as="h1">
          {unit.name} News
        </Typography>
      </LayoutContent>

      <CustomFooter tags={[]} units={[unit.id]} />

      <Footer></Footer>
    </Layout>
  );
}
