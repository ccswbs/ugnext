"use client";

import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import { ProfileGrid } from "../people/profile-grid";

// Type definition matching the GraphQL fragment
interface ProfileBlockData {
  __typename: "ParagraphProfileBlock";
  id: string;
  profileType?: {
    name: string;
  }[];
  researchArea?: {
    name: string;
  }[];
  unit?: {
    name: string;
  }[];
  profiles?: any[];
}

interface ProfileBlockProps {
  data: ProfileBlockData;
}

export const ProfileBlock = ({ data }: ProfileBlockProps) => {
  // Use the pre-fetched profiles from the data object
  const profiles = data.profiles || [];

  // Filter profiles based on the block configuration
  const filteredProfiles = profiles.filter(profile => {
    // Filter by profile type if specified
    if (data.profileType && data.profileType.length > 0) {
      const typeNames = data.profileType.map(t => t.name);
      const hasMatchingType = typeNames.includes(profile.profileType?.name);
      if (!hasMatchingType) {
        return false;
      }
    }

    // Filter by research area if specified
    if (data.researchArea && data.researchArea.length > 0) {
      const researchNames = data.researchArea.map(r => r.name);
      const hasMatchingResearch = profile.profileResearchAreas?.some(
        (area: any) => researchNames.includes(area.name)
      );
      if (!hasMatchingResearch) {
        return false;
      }
    }

    // Filter by unit if specified
    if (data.unit && data.unit.length > 0) {
      const unitNames = data.unit.map(u => u.name);
      const hasMatchingUnit = profile.profileUnit?.some(
        (unit: any) => unitNames.includes(unit.name)
      );
      if (!hasMatchingUnit) {
        return false;
      }
    }

    return true;
  });

  // Generate a title based on the filters
  const generateTitle = () => {
    const parts = [];
    if (data.profileType && data.profileType.length > 0) {
      const types = data.profileType.map(t => t.name);
      parts.push(types.join(' & '));
    }
    if (data.researchArea && data.researchArea.length > 0) {
      const areas = data.researchArea.map(r => r.name);
      parts.push(`in ${areas.join(' & ')}`);
    }
    if (data.unit && data.unit.length > 0) {
      const units = data.unit.map(u => u.name);
      parts.push(`from ${units.join(' & ')}`);
    }
    
    return parts.length > 0 ? parts.join(' ') : 'Profiles';
  };

  return (
    <Container>
      <div className="mb-6 @container">
        <Typography type="h2" as="h2" className="mb-4">
          {generateTitle()}
        </Typography>
        
        {filteredProfiles.length > 0 ? (
          <ProfileGrid 
            profiles={filteredProfiles} 
            gridClasses="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          />
        ) : (
          <div className="flex w-full items-center justify-center py-8">
            <Typography type="body" className="text-black/50">
              No profiles matching the specified criteria were found.
            </Typography>
          </div>
        )}
      </div>
    </Container>
  );
};
