"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileBlockFragment } from "@/lib/graphql/types";
import { ProfileSearch } from "@/components/client/profiles/profile-search";

export const ProfileBlock = ({ data }: { data: ProfileBlockFragment }) => {
  return (
    <ProfileSearch
      queryByName={{
        enabled: false,
      }}
      queryByResearchArea={{
        enabled: false,
      }}
      units={{
        enabled: false,
        defaultValue: data.unit?.map((unit) => unit.id) ?? undefined,
      }}
      types={{
        enabled: false,
      }}
      isAcceptingGraduateStudents={{
        enabled: false,
      }}
    />
  );
};
