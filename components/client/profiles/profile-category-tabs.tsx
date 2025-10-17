"use client";

import type { ProfileCategory } from "@/data/drupal/profile";
import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import Link from "next/link";
import { Container } from "@uoguelph/react-components/container";
import { usePathname } from "next/navigation";

export function ProfileCategoryTabs({ categories }: { categories: ProfileCategory[] }) {
  const pathname = usePathname();
  const activeCategory = pathname.split("/").pop();

  return (
    <Container className="mb-0">
      <Navigation>
        <NavigationLink href="/people" as={Link} active={activeCategory === "people" || !activeCategory}>
          All
        </NavigationLink>

        {categories.map((category) => {
          const categorySlug = (category.path ?? "").split("/").pop();
          const href = `/people/${(category.path ?? "").split("/").pop()}`;

          return (
            <NavigationLink key={category.id} href={href} as={Link} active={activeCategory === categorySlug}>
              {category.name}
            </NavigationLink>
          );
        })}
      </Navigation>
    </Container>
  );
}
