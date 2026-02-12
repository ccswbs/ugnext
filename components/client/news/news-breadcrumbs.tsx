"use client";

import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import Link from "next/link";
import { slugify } from "@/lib/string-utils";
import React from "react";
import { NewsCategoryFragment, NewsFragment, UnitFragment } from "@/lib/graphql/types";

export function NewsBreadcrumbs({
  title,
  categories,
  primaryNavigation,
}: {
  title: string;
  categories: NewsCategoryFragment[];
  primaryNavigation?: NewsFragment["primaryNavigation"];
}) {
  let directory: string;
  let directoryName: string;

  if (primaryNavigation && primaryNavigation.newsUrlAliasPattern && primaryNavigation.menuName !== "no-menu") {
    directory = `/news${primaryNavigation.newsUrlAliasPattern}`;
    directoryName = primaryNavigation.name;
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

      {categories.length > 0 && (
        <Breadcrumb as="span">
          <ul>
            {categories.map((category, index) => (
              <li key={index} className="inline">
                <Link
                  className="underline decoration-transparent decoration-1 transition-colors hocus-visible:decoration-black"
                  href={`${directory}?categories=${category.id}`}
                >
                  {category.name}
                </Link>
                <span aria-hidden={true}>{index < categories.length - 1 && " / "}</span>
              </li>
            ))}
          </ul>
        </Breadcrumb>
      )}

      <Breadcrumb as="span">{title}</Breadcrumb>
    </Breadcrumbs>
  );
}
