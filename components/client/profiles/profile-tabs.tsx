"use client";

import type { ProfileType } from "@/data/drupal/profile";
import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import Link from "next/link";
import { Container } from "@uoguelph/react-components/container";
import { usePathname } from "next/navigation";

export function ProfileTabs({ types }: { types: ProfileType[] }) {
  const pathname = usePathname();
  const activeType = pathname.split("/").pop();

  return (
    <Container className="pb-0 mb-0">
      <Navigation>
        {types.map((type) => {
          const typeSlug = (type.path ?? "").split("/").pop();
          const href = `/people/${(type.path ?? "").split("/").pop()}`;

          return (
            <NavigationLink key={type.id} href={href} as={Link} active={activeType === typeSlug}>
              {type.name}
            </NavigationLink>
          );
        })}
      </Navigation>
    </Container>
  );
}
