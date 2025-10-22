"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileBlockFragment } from "@/lib/graphql/types";
import { ProfileSearch } from "@/components/client/profiles/profile-search";

export const ProfileBlock = ({ data }: { data: ProfileBlockFragment }) => {
  // Map the GraphQL units to the expected Unit type
  const availableUnits = data.unit?.map((unit) => ({
    __typename: "TermUnit" as const,
    id: unit.id,
    name: unit.name,
    parent: null // GraphQL fragment doesn't include parent, so set to null
  }));

  return (
    <ProfileSearch
      queryByName={{
        enabled: data.enableNameSearch ?? false,
      }}
      queryByResearchArea={{
        enabled: data.enableResearchFilter ?? false,
      }}
      units={{
        enabled: data.enableUnitFilter ?? false,
        defaultValue: data.unit?.map((unit) => unit.id) ?? undefined,
      }}
      types={{
        enabled: data.enableTypeFilter ?? false,
      }}
      isAcceptingGraduateStudents={{
        enabled: false,
      }}
      availableUnits={availableUnits}
    />
  );
};
