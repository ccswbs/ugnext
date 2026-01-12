"use client";

import { createContext } from "react";
import { Grid } from "@uoguelph/react-components/grid";

export type SectionContextValue = {
  column: "primary" | "secondary";
  equal: boolean;
  hasSecondary: boolean;
};

export const SectionContext = createContext<SectionContextValue | null>(null);

export type SectionProps = {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  equal?: boolean;
};
export const Section = ({ primary, secondary, equal = false }: SectionProps) => {
  const hasSecondary = Array.isArray(secondary) ? secondary.length > 0 : Boolean(secondary);

  return hasSecondary ? (
    <Grid
      template={{
        base: ["1fr"],
        md: equal ? ["1fr", "1fr"] : ["3fr", "1fr"],
      }}
      gap={{
        x: 16,
        y: 16,
      }}
    >
      <SectionContext.Provider value={{ column: "primary", equal, hasSecondary }}>
        <div data-title="primary" className="w-full group/section-primary">
          {primary}
        </div>
      </SectionContext.Provider>

      {secondary && (
        <SectionContext.Provider value={{ column: "secondary", equal, hasSecondary }}>
          <div data-title="secondary" className="w-full group/section-secondary">
            {secondary}
          </div>
        </SectionContext.Provider>
      )}
    </Grid>
  ) : (
    <SectionContext.Provider value={{ column: "primary", equal, hasSecondary }}>{primary}</SectionContext.Provider>
  );
};
