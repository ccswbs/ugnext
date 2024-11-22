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
        "-ml-0.5 px-0.5 py-1 underline transition-colors hover:decoration-transparent focus:outline-none focus:ring-2 focus:ring-offset-2",
        color === "blue" && "text-blue-600 hover:bg-blue hover:text-white focus:text-blue-800 focus:ring-blue",
        color === "red" && "text-red hover:bg-red hover:text-white focus:text-red-800 focus:ring-red",
        color === "yellow" && "text-yellow hover:bg-yellow hover:text-white focus:text-yellow-600 focus:ring-yellow",
        color === "green" && "text-green hover:bg-green hover:text-white focus:text-green-800 focus:ring-green",
        color === "gray" && "text-gray hover:bg-gray hover:text-white focus:text-gray-600 focus:ring-gray",
        color === "black" && "text-black hover:bg-black hover:text-white focus:text-black-800 focus:ring-black",
        color === "white" && "text-white hover:bg-white hover:text-black focus:text-white-800 focus:ring-white"
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
