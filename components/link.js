import NextLink from "next/link";
import { twJoin, twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

export const UnstyledLink = ({ href, children, ...rest }) => {
  const isExternal = /^(\/\/|[a-z]+:)/.test(href);

  return isExternal ? (
    <a {...rest} href={href}>
      {children}
    </a>
  ) : (
    <NextLink {...rest} href={href}>
      {children}
    </NextLink>
  );
};

export const Link = ({ href, color = "blue", children, className, ...rest }) => (
  <UnstyledLink
    {...rest}
    href={href}
    className={twMerge(
      twJoin(
        "-ml-0.5 px-0.5 py-1 underline transition-colors hover:decoration-transparent focus:outline-hidden focus:ring-2 focus:ring-offset-2",
        color === "blue" && "text-body-copy-link focus:text-blue-800 focus:ring-blue",
        color === "red" && "text-red focus:text-red-800 focus:ring-red",
        color === "yellow" && "text-yellow focus:text-yellow-600 focus:ring-yellow",
        color === "green" && "text-green focus:text-green-800 focus:ring-green",
        color === "gray" && "text-gray focus:text-gray-600 focus:ring-gray",
        color === "black" && "text-black focus:text-black-800 focus:ring-black",
        color === "white" && "text-white focus:text-white-800 focus:ring-white"
      ),
      className
    )}
  >
    {children}
  </UnstyledLink>
);

UnstyledLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

Link.propTypes = {
  ...UnstyledLink.propTypes,
  color: PropTypes.oneOf(["blue", "red", "yellow", "green", "gray", "black", "none"]),
  className: PropTypes.string,
};
