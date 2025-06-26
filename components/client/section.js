"use client";

import { createContext } from "react";
import { twJoin } from "tailwind-merge";
import PropTypes from "prop-types";

export const SectionContext = createContext(null);

export const Section = ({ primary, secondary, equal = false }) => {
  const hasSecondary = Array.isArray(secondary) ? secondary.length > 0 : Boolean(secondary);

  return hasSecondary ? (
    <div
      className={twJoin("grid w-full grid-cols-1 gap-4", equal ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[3fr_1fr]")}
    >
      <SectionContext.Provider value={{ column: "primary", equal }}>
        <div>{primary}</div>
      </SectionContext.Provider>

      {secondary && (
        <SectionContext.Provider value={{ column: "secondary", equal, hasSecondary }}>
          <div>{secondary}</div>
        </SectionContext.Provider>
      )}
    </div>
  ) : (
    <SectionContext.Provider value={{ column: "primary", equal, hasSecondary }}>
      <>{primary}</>
    </SectionContext.Provider>
  );
};

Section.propTypes = {
  primary: PropTypes.node.isRequired,
  secondary: PropTypes.node.isRequired,
  /**
   * Determines whether both columns are equal in width
   */
  equal: PropTypes.bool,
};
