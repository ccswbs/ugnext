import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { twJoin, twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

export const Blockquote = ({ className, children, color = "yellow" }) => {
  const markClasses = twJoin(
    "inline-block h-[1em]",
    color === "yellow" && "text-yellow",
    color === "red" && "text-red",
    color === "blue" && "text-blue"
  );

  return (
    <blockquote className={twMerge("block w-full text-center text-3xl italic", className)}>
      <FontAwesomeIcon icon={faQuoteLeft} className={twJoin(markClasses, "mr-[0.3em]")} />
      <span>{children}</span>
      <FontAwesomeIcon icon={faQuoteRight} className={twJoin(markClasses, "ml-[0.25em]")} />
    </blockquote>
  );
};

Blockquote.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(["yellow", "red", "blue"]),
};
