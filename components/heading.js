import { clamp } from "@/lib/math-utils";
import { twJoin, twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

export const Heading = ({ level, children, className, as, ...rest }) => {
  const headingLevel = clamp(level || 1, 1, 6);
  const Tag = as ?? `h${headingLevel}`;

  return (
    <Tag
      {...rest}
      className={twMerge(
        twJoin(
          "font-bold leading-tight",
          headingLevel === 1 && "font-serif mb-[3rem] text-[4rem]",
          headingLevel === 2 && "mb-[1.5rem] text-[3rem] text-uog-color-red",
          headingLevel === 3 && "mb-[1.5rem] text-[2.5rem]",
          headingLevel === 4 && "mb-[1.5rem] text-[2rem]",
          headingLevel === 5 && "mb-[1.5rem] text-[1.75rem]",
          headingLevel === 6 && "mb-[1.5rem] text-[1.5rem]"
        ),
        className
      )}
    >
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * What element to render this button as
   */
  as: PropTypes.string,
};
