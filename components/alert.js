import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@awesome.me/kit-7993323d0c/icons/classic/regular";
import { twJoin } from "tailwind-merge";
import PropTypes from "prop-types";
import { Accordion } from "@/components/accordion";

/**
 * A simple way to inform the user of something, works best within a Modal
 */
export const Alert = ({ type = "danger", title, subtitle, message, footer }) => (
  <div className="flex flex-col">
    <div
      className={twJoin(
        "flex items-center gap-2 p-4 text-xl",
        type === "danger" && "bg-red text-white",
        type === "warning" && "bg-yellow text-black",
        type === "info" && "bg-blue text-white"
      )}
    >
      <FontAwesomeIcon className="h-[1.5em]" icon={faCircleExclamation} />
      <span>{title}</span>
    </div>

    <div className={`flex flex-col border-x border-b border-grey bg-white px-4 py-3`}>
      <span className="mb-4 text-xl font-bold">{subtitle}</span>
      <span className="text-lg">{message}</span>
    </div>

    {footer && <div className="flex bg-grey px-4 py-2">{footer}</div>}
  </div>
);

Alert.propTypes = {
  type: PropTypes.oneOf(["danger", "warning", "info"]),
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
  footer: PropTypes.node,
};
