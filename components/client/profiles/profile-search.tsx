"use client";

import { PaginatedGrid } from "@/components/client/paginated-grid";
import type { PartialProfileData } from "@/data/drupal/profile";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/profiles/profile-card";
import { ProfileSearchBar } from "@/components/client/profiles/profile-search-bar";

export type ProfileSearchParams = {
  userFilters: {
    queryByName: boolean;
    queryByResearchArea: boolean;
    units: boolean;
    types: boolean;
    isAcceptingGraduateStudents: boolean;
  };
  defaultFilters: {
    queryByName: string;
    queryByResearchArea: string;
    units: string[];
    types: string[];
    isAcceptingGraduateStudents: boolean | null;
  };
};

export function ProfileSearch() {
  return (
    <>
      <ProfileSearchBar
        searchByName={true}
        searchByResearchArea={true}
        filterByUnits={false}
        filterByTypes={false}
        filterByAcceptingGraduateStudents={false}
        filterByCategories={false}
      />

      <Container>
        <PaginatedGrid
          url="/api/profiles/get-profiles"
          render={(item: PartialProfileData) => <ProfileCard key={item.id} data={item} />}
        />
      </Container>
    </>
  );
}
