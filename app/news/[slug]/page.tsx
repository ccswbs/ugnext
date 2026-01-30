import { notFound } from "next/navigation";
import { getRoute } from "@/data/drupal/route";
import { News } from "@/components/server/news";
import { getUnitBySlugifiedName } from "@/data/drupal/taxonomy";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NewsArticle({ params }: Props) {
  const { slug: unitName } = await params;

  const unit = await getUnitBySlugifiedName(unitName);

  return <>{JSON.stringify(unit)}</>;
}
