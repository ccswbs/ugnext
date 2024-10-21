import PropTypes from "prop-types";

export const Footer = ({ links, variant = "guelph" }) => (
  <uofg-footer variant={variant}>
    {Array.isArray(links) &&
      links?.map((link) => {
        return (
          <a key={link.url + link.title} href={link.url}>
            {link.title}
          </a>
        );
      })}
  </uofg-footer>
);

Footer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  variant: PropTypes.oneOf(["guelph", "ridgetown"]),
};
