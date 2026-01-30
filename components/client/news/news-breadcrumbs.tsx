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
  const categoryIDs = categories.map((category) => category.id).join(",") ?? "";

  return (
    <Breadcrumbs>
      <BreadcrumbHome />
      <Breadcrumb href={directory} as={Link}>
        {unit.name} News
      </Breadcrumb>

      {categories.length > 0 && (
        <Breadcrumb as="span">
          {categories.map((category, index) => (
            <span key={index}>
              <Link
                className="underline decoration-transparent decoration-1 transition-colors hocus-visible:decoration-black"
                href={`${directory}?categories=${categoryIDs}`}
              >
                {category.name}
              </Link>
              {index < categories.length - 1 && " / "}
            </span>
          ))}
        </Breadcrumb>
      )}

      <Breadcrumb as="span">{title}</Breadcrumb>
    </Breadcrumbs>
  );
}
