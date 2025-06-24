import { getRouteInfo } from "@/data/drupal/route";
import { notFound, permanentRedirect, redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const url = "/" + slug.join("/");
  const info = await getRouteInfo(url);

  // Couldn't get info for this page from Drupal.
  if (!info) {
    notFound();
  }

  // This page is redirecting to another, so we follow the redirect
  if (info.__typename === "RouteRedirect") {
    info.status === 301 ? permanentRedirect(info.url) : redirect(info.url);
  }

  if (info.__typename === "RouteInternal") {
    switch (info?.entity?.__typename) {
      // Spotlightss should just
      case "NodeSpotlight":
        permanentRedirect("/");
    }
  }

  return (
    <div>
      {url} {JSON.stringify(info)}
    </div>
  );
}
