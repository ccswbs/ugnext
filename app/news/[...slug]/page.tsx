import { notFound } from "next/navigation";
import { getRoute } from "@/data/drupal/route";
import { News } from "@/components/server/news";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;
  const path = "/news/" + slug.join("/");
  const route = await getRoute(path);

  if (!route || route.__typename !== "RouteInternal" || !route.entity || route.entity.__typename !== "NodeNews") {
    notFound();
  }

  const id = route.entity.id;

  return <News id={id} />;
}
