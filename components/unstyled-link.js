import NextLink from "next/link";
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

UnstyledLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
