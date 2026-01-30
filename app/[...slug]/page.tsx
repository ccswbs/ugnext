import { getRoute } from "@/data/drupal/route";
import { Metadata, ResolvingMetadata } from "next";
import { BasicPage } from "@/components/server/basic-page";
import { Profile } from "@/components/server/profile";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { News } from "@/components/server/news";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const url = "/" + slug.join("/");
  const route = await getRoute(url);

  // If the entity associated with this route has a title, we can use it for the page title.
  if (route && route.__typename === "RouteInternal" && route?.entity && "title" in route.entity) {
    return {
      title: route.entity.title,
    };
  }

  return {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const url = "/" + slug.join("/");
  const route = await getRoute(url);

  // Handle redirects to other pages.
  // Couldn't get info for this route from Drupal.
  if (!route) {
    notFound();
  }

  // This page is redirecting to another, so we follow the redirect
  if (route.__typename === "RouteRedirect") {
    route.status === 301 ? permanentRedirect(route.url) : redirect(route.url);
  }

  // Most likely RouteExternal which means we should just 404
  if (route.__typename !== "RouteInternal") {
    notFound();
  }

  // No entity associated with this route so just 404
  if (!route.entity?.__typename) {
    notFound();
  }

  // We only care about Node entities, which will always be fetched with their UUID and title, so if they aren't present, 404.
  if (!("uuid" in route.entity) && !("title" in route.entity)) {
    notFound();
  }

  // Spotlights are only used on the home page, not as their own pages, so redirect to the home page.
  if (route.entity.__typename === "NodeSpotlight") {
    permanentRedirect("/");
  }

  switch (route.entity.__typename) {
    case "NodePage":
      return <BasicPage id={route.entity.uuid} />;
    case "NodeArticle":
      permanentRedirect(`/ovc/news/node/${route.entity.id}`);
      break;
    case "NodeNews":
      return <News id={route.entity.id} />;
    case "NodeProfile":
      return <Profile id={route.entity.uuid} />;
    case "NodeUndergraduateProgram":
    case "NodeUndergraduateDegree":
      permanentRedirect("/programs/undergraduate/");
      break;
    case "NodeUndergraduateRequirement":
      permanentRedirect("/programs/undergraduate/requirements/");
      break;
    default:
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Attempted to render a page with an entity type ${route.entity.__typename} but no component is set to render that type in app/[...slug]/page.tsx.`
        );
      }
      notFound();
  }
}
