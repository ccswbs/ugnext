import React from "react";
import { useRouter } from "next/router";
import { twJoin } from "tailwind-merge";
import PropTypes from "prop-types";

export const Navigation = ({ fullWidth = true, links, label }) => {
  const { pathname } = useRouter();

  return (
    <nav aria-label={label}>
      <ul
        className={twJoin("flex flex-col gap-1 border-b-4 border-uog-yellow md:flex-row", fullWidth ? "w-full" : "w-fit")}
      >
        {links.map((link, index) => (
          <li className="contents" key={index}>
            <a
              aria-current={pathname === link?.href ? "page" : undefined}
              className={twJoin(
                "mb-1 flex items-center justify-center rounded-t-sm bg-uog-grey-light-bg px-4 py-3 text-center text-lg font-bold text-black transition-colors hover:bg-uog-grey-light focus:bg-uog-grey-light focus:outline-none aria-page-current:mb-0 aria-page-current:border-2 aria-page-current:border-uog-yellow aria-page-current:bg-uog-yellow",
                fullWidth && "flex-1"
              )}
              href={link?.href}
            >
              {link?.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  /**
   * Determines whether the navigation will take up the full width of its container
   */
  fullWidth: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /**
   * A label for screen readers to announce when focused in the navigation
   */
  label: PropTypes.string.isRequired,
};
