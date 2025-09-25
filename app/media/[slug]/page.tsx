import { notFound, permanentRedirect } from "next/navigation";
import { getMediaPathById } from "@/data/drupal/media";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MediaPage({ params }: Props) {
  const { slug } = await params;
  const path = await getMediaPathById(slug);

  if (!path) {
    notFound();
  }

  permanentRedirect(path);
}
