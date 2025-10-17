"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import type { PartialProfileData } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/profiles/profile-card";

export type ProfileSearchParams = {
  userFilters: {
    queryByName: boolean;
    queryByResearchArea: boolean;
    units: boolean;
    isAcceptingGraduateStudents: boolean;
    categories: boolean;
  };
  defaultFilters: {
    queryByName: string;
    queryByResearchArea: string;
    units: string[];
    types: string[];
    isAcceptingGraduateStudents: boolean | null;
    categories: string[];
  };
};

export function ProfileSearch() {
  return (
    <Container>
      <PaginatedGrid
        url="/api/profiles/get-profiles"
        render={(item: PartialProfileData) => <ProfileCard key={item.id} data={item} />}
      />
    </Container>
  );
}
