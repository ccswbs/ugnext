import { twJoin, twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

/**
 * A generic container component which changes max-width based on the screen size: 640px, 768px, 1024px, 1280px, 1320px
 */
export const Container = ({ as = "div", centered = false, children, className, ...rest }) => {
  const Tag = as;

  return (
    <Tag
      {...rest}
      className={twMerge(twJoin("container max-w-max-content px-4 pb-4 pt-2", centered && "mx-auto"), className)}
    >
      {children}
    </Tag>
  );
};

Container.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  centered: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};
