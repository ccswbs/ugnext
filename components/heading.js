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
          headingLevel === 1 && "mt-[2rem] mb-[0rem] text-2xl font-primary-bitter",
          headingLevel === 2 && "mt-[3rem] mb-[1.5rem] text-1.5xl font-secondary-dm-sans",
          headingLevel === 3 && "mt-[3rem] mb-[1.5rem] text-xl-s font-secondary-dm-sans",
          headingLevel === 4 && "mt-[3rem] mb-[1.5rem] text-xl font-secondary-dm-sans",
          (headingLevel === 5 || headingLevel === 6) && "mt-[3rem] mb-[1.5rem] text-xl font-secondary-dm-sans"
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
