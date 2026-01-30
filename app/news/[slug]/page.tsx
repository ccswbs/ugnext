import { notFound } from "next/navigation";
import { getRoute } from "@/data/drupal/route";
import { News } from "@/components/server/news";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const unit = slug[0];

  return <>{unit}</>;
}
