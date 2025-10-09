"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { ProfileGrid } from "@/components/client/profiles/profile-grid";
import { useMemo } from "react";
import { ProfileType, ProfileResearchArea, ProfileUnit, FullProfile } from "@/lib/types/profile";

// Component-specific interface that extends shared types
interface ProfileBlockData {
  __typename: "ParagraphProfileBlock";
  id: string;
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6" | null;
  profileBlockTitle: string;
  profileType?: ProfileType[];
  researchArea?: ProfileResearchArea[];
  unit?: ProfileUnit[];
  profiles?: FullProfile[];
}

interface ProfileBlockProps {
  data: ProfileBlockData;
}

export const ProfileBlock = ({ data }: ProfileBlockProps) => {
  // Use the pre-fetched profiles from the data object and deduplicate by ID
  const profiles = useMemo(() => {
    const rawProfiles = data.profiles || [];
    
    console.log('ProfileBlock component received profiles:', rawProfiles.length);
    console.log('ProfileBlock widget config:', {
      profileType: data.profileType,
      unit: data.unit,
      researchArea: data.researchArea
    });
    
    const uniqueProfiles = new Map();
    
    // Deduplicate profiles by ID (in case backend returns same profile from multiple type queries)
    rawProfiles.forEach((profile: any) => {
      if (profile.id && !uniqueProfiles.has(profile.id)) {
        uniqueProfiles.set(profile.id, profile);
      }
    });
    
    return Array.from(uniqueProfiles.values());
  }, [data.profiles]);

  return (
    <>
      {data.profileBlockTitle && (
        <Container>
          <Typography 
            type={data.headingLevel ?? "h2"} 
            as={data.headingLevel ?? "h2"}
          >
            {data.profileBlockTitle}
          </Typography>
        </Container>
      )}
      
      {profiles.length > 0 ? (
        <Container>
          <ProfileGrid
            profiles={profiles}
            gridClasses="grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]"
          />
        </Container>
      ) : (
        <div className="flex w-full items-center justify-center py-8">
          <Typography type="body" className="text-black/50">
            No profiles found.
          </Typography>
        </div>
      )}
    </>
  );
};
