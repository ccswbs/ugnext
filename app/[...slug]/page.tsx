import { getRouteInfo, InternalRoute, InternalRouteEntityWithTitle, Route } from "@/data/drupal/route";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { BasicPage } from "@/components/content-types/basic-page";

type Props = {
  params: Promise<{ slug: string[] }>;
};

async function handleRedirect(info: Route | undefined | null) {
  // Couldn't get info for this page from Drupal.
  if (!info) {
    notFound();
  }

  // This page is redirecting to another, so we follow the redirect
  if (info.__typename === "RouteRedirect") {
    info.status === 301 ? permanentRedirect(info.url) : redirect(info.url);
  }

  // Most likely RoutExternal which means we should just 404
  if (info.__typename !== "RouteInternal") {
    notFound();
  }

  // No entity associated with this route so just 404
  if (!info.entity?.__typename) {
    notFound();
  }

  // Spotlights are only used on the home page, not as their own pages, so redirect to the home page.
  if (info.entity.__typename === "NodeSpotlight") {
    permanentRedirect("/");
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const url = "/" + slug.join("/");
  const route = await getRouteInfo(url);

  // If the entity associated with this route has a title, we can use it for the page title.
  if (route && route.__typename === "RouteInternal" && route?.entity && "title" in route.entity) {
    return {
      title: (route.entity as InternalRouteEntityWithTitle).title,
    };
  }

  return {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const url = "/" + slug.join("/");
  const route = await getRouteInfo(url);

  // Handle redirects to other pages.
  await handleRedirect(route);

  // At this point handleRedirect would have dealt with any routes that aren't RouteInternal so the type coercion is fine
  const internalRoute = route as InternalRoute;

  switch (internalRoute.entity?.__typename) {
    case "NodePage":
      return <BasicPage id={internalRoute.entity.uuid} title={internalRoute.entity.title} />;
    default:
      notFound();
  }
}
