import { twJoin, twMerge } from "tailwind-merge";
import { useContext, createContext } from "react";
import PropTypes from "prop-types";

const ListContext = createContext(null);

export const List = ({ variant = "unordered", children, className, ...rest }) => {
  const Tag = variant === "ordered" ? "ol" : "ul";
  const context = useContext(ListContext);

  return (
    <Tag
      {...rest}
      className={twMerge(
        twJoin(
          "flex flex-col gap-1 my-2",
          variant === "ordered" && "gap-2 [counter-reset:list-number]",
          context?.nested && "mt-0"
        ),
        className
      )}
    >
      <ListContext.Provider value={{ variant, nested: typeof context === "object" }}>{children}</ListContext.Provider>
    </Tag>
  );
};

export const ListItem = ({ className, children }) => {
  const { variant } = useContext(ListContext);

  return (
    <li
      className={twMerge(
        "relative h-fit w-full ml-5",
        variant !== "ordered" &&
          "list-disc",
        variant === "ordered" &&
          "list-decimal",
        className
      )}
    >
      {children}
    </li>
  );
};

List.propTypes = {
  variant: PropTypes.oneOf(["unordered", "ordered"]),
  children: PropTypes.node,
  className: PropTypes.string,
};

ListItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
