"use client";

import React from "react";
import { Container } from "@uoguelph/react-components/container";
import { ProfileCard } from "@/components/client/widgets/profile-card";
import type { ProfileCardFragment } from "@/lib/graphql/types";

interface ProfileCardGroupProps {
  cards: ProfileCardFragment[];
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string;
  className?: string;
}

export const ProfileCardGroup = ({ 
  cards, 
  columns = { sm: 1, md: 2, lg: 2, xl: 2 }, 
  gap = "1.5rem",
  className = ""
}: ProfileCardGroupProps) => {
  if (cards.length === 0) return null;
  
  // If only one card, render it without multicolumn layout
  if (cards.length === 1) {
    return (
      <Container>
        <ProfileCard data={cards[0]} inMultiColumn={false} />
      </Container>
    );
  }

  // Handle responsive columns
  const isResponsive = typeof columns === 'object';
  const columnStyles = isResponsive ? {
    columnCount: columns.xl || 2, // Default for largest screens
    columnGap: gap,
    columnFill: 'balance' as const,
    orphans: 1,
    widows: 1
  } : {
    columnCount: columns,
    columnGap: gap,
    columnFill: 'balance' as const,
    orphans: 1,
    widows: 1
  };

  // Create responsive column CSS variables
  const responsiveStyles = isResponsive ? {
    '--columns-sm': columns.sm || 1,
    '--columns-md': columns.md || 2,
    '--columns-lg': columns.lg || 2,
    '--columns-xl': columns.xl || 2,
    '--column-gap': gap,
    columnGap: gap,
    columnFill: 'balance' as const,
    orphans: 1,
    widows: 1,
    maxWidth: '100%',
    overflow: 'hidden'
  } as React.CSSProperties : {
    ...columnStyles,
    maxWidth: '100%',
    overflow: 'hidden'
  };

  return (
    <Container>
      <div 
        className={`profile-card-group multicolumn-safe overflow-hidden max-w-full ${className}`}
        style={responsiveStyles}
      >
      <style dangerouslySetInnerHTML={{
        __html: isResponsive ? `
          .profile-card-group {
            column-count: var(--columns-xl, 2);
            box-sizing: border-box;
            max-width: 100%;
          }
          @media (max-width: 640px) {
            .profile-card-group { column-count: var(--columns-sm, 1); }
          }
          @media (min-width: 641px) and (max-width: 768px) {
            .profile-card-group { column-count: var(--columns-md, 2); }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .profile-card-group { column-count: var(--columns-lg, 2); }
          }
        ` : ''
      }} />
      {cards.map((card, index) => (
        <div 
          key={`${card.__typename}-${index}`}
          style={{
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
            marginBottom: gap,
            display: 'inline-block',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <ProfileCard data={card} inMultiColumn={true} />
        </div>
      ))}
      </div>
    </Container>
  );
};