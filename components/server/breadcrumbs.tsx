import {
  Breadcrumbs as BreadcrumbsComponent,
  Breadcrumb,
  BreadcrumbHome,
} from "@uoguelph/react-components/breadcrumbs";
import { getRouteBreadcrumbs } from "@/data/drupal/route";

export async function Breadcrumbs({ url }: { url?: string }) {
  const breadcrumbs = url ? await getRouteBreadcrumbs(url) : [];

  return (
    <BreadcrumbsComponent className="text-base">
      <BreadcrumbHome href="/" />

      {breadcrumbs?.map((breadcrumb) => {
        if ("url" in breadcrumb && breadcrumb.url) {
          return (
            <Breadcrumb className="text-base" key={breadcrumb.url} href={breadcrumb.url}>
              {breadcrumb.title}
            </Breadcrumb>
          );
        }

        return <Breadcrumb key={breadcrumb.title}>{breadcrumb.title}</Breadcrumb>;
      })}
    </BreadcrumbsComponent>
  );
}
