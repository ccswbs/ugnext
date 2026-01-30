"use client";

import { Breadcrumb, BreadcrumbHome, Breadcrumbs } from "@uoguelph/react-components/breadcrumbs";
import Link from "next/link";
import { slugify } from "@/lib/string-utils";
import React from "react";
import { NewsCategoryFragment, UnitFragment } from "@/lib/graphql/types";

export function NewsBreadcrumbs({
  title,
  categories,
  unit,
}: {
  title: string;
  categories: NewsCategoryFragment[];
  unit: UnitFragment;
}) {
  const directory = `/news/${slugify(unit.name)}`;

  return (
    <Breadcrumbs>
      <BreadcrumbHome />
      <Breadcrumb href={directory} as={Link}>
        {unit.name}
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
