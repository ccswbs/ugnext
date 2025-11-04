import {
  Breadcrumbs as BreadcrumbsComponent,
  Breadcrumb,
  BreadcrumbHome,
} from "@uoguelph/react-components/breadcrumbs";
import { getRouteBreadcrumbs } from "@/data/drupal/route";

export async function Breadcrumbs({ url, primary_navigation }: { url?: string, primary_navigation?: string }) {
  const breadcrumbs = url ? await getRouteBreadcrumbs(url, primary_navigation) : [];

  return (
    <BreadcrumbsComponent className="text-base">
      <BreadcrumbHome href="/" />

      {breadcrumbs?.map((breadcrumb, index) => {
        if ("url" in breadcrumb && breadcrumb.url) {
          return (
            <Breadcrumb className="text-base" key={`${breadcrumb.url}-${index}`} href={breadcrumb.url}>
              {breadcrumb.title}
            </Breadcrumb>
          );
        }

        return <Breadcrumb key={`${breadcrumb.title}-${index}`}>{breadcrumb.title}</Breadcrumb>;
      })}
    </BreadcrumbsComponent>
  );
}
