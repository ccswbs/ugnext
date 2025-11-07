"use client";

import type { ProfileType } from "@/data/drupal/profile";
import { Navigation, NavigationLink } from "@uoguelph/react-components/navigation";
import { Container } from "@uoguelph/react-components/container";
import { useState } from "react";

export interface ProfileTypeFilterProps {
  types: ProfileType[];
  onTypeChange: (typeId: string | null) => void;
  defaultTypeId?: string | null;
}

export function ProfileTypeFilter({ types, onTypeChange, defaultTypeId = null }: ProfileTypeFilterProps) {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(defaultTypeId);

  const handleTypeClick = (e: React.MouseEvent, typeId: string | null) => {
    e.preventDefault(); // Prevent navigation
    setSelectedTypeId(typeId);
    onTypeChange(typeId);
  };

  return (
    <Container className="pb-0 mb-0">
      <Navigation>
        {/* "All" tab to show all profile types */}
        <NavigationLink 
          href="#"
          active={selectedTypeId === null}
          onClick={(e: React.MouseEvent) => handleTypeClick(e, null)}
        >
          All
        </NavigationLink>
        
        {types.map((type) => (
          <NavigationLink 
            key={type.id}
            href="#"
            active={selectedTypeId === type.id}
            onClick={(e: React.MouseEvent) => handleTypeClick(e, type.id)}
          >
            {type.name}
          </NavigationLink>
        ))}
      </Navigation>
    </Container>
  );
}