"use client";

import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import Link from "next/link";
import { slugify } from "@/lib/string-utils";
import React from "react";
import { NewsCategoryFragment, NewsFragment, UnitFragment } from "@/lib/graphql/types";

export function NewsBreadcrumbs({ data }: { data: NewsFragment }) {
  let directory: string;
  let directoryName: string;

  if (
    data.primaryNavigation &&
    data.primaryNavigation.newsUrlAliasPattern &&
    data.primaryNavigation.menuName !== "no-menu"
  ) {
    directory = `/news${data.primaryNavigation.newsUrlAliasPattern}`;
    directoryName = data.primaryNavigation.name;
  } else {
    directory = "/news";
    directoryName = "News";
  }

  return (
    <Breadcrumbs>
      <BreadcrumbHome />
      <Breadcrumb href={directory} as={Link}>
        {directoryName}
      </Breadcrumb>

      {data.category && data.category.length > 0 && (
        <Breadcrumb as="span">
          <ul>
            {data.category.map((category, index) => (
              <li key={index} className="inline">
                <Link
                  className="underline decoration-transparent decoration-1 transition-colors hocus-visible:decoration-black"
                  href={`${directory}?categories=${category.id}`}
                >
                  {category.name}
                </Link>

                {data.category && <span aria-hidden={true}>{index < data.category.length - 1 && " / "}</span>}
              </li>
            ))}
          </ul>
        </Breadcrumb>
      )}

      <Breadcrumb as="span">{data.title}</Breadcrumb>
    </Breadcrumbs>
  );
}
