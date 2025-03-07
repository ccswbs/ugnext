import { twJoin } from "tailwind-merge";
import PropTypes from "prop-types";

export const Info = ({ children, color = "red" }) => (
  <div
    className={twJoin(
      "flex flex-col gap-1 border-l-4 pl-4",
      color === "yellow" && "border-l-uog-yellow",
      color === "red" && "border-l-uog-red",
      color === "blue" && "border-l-uog-blue"
    )}
  >
    {children}
  </div>
);

Info.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(["red", "yellow", "blue"]),
};
