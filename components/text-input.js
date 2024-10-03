import { Description, Field, Input, Label } from "@headlessui/react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@awesome.me/kit-7993323d0c/icons/classic/regular";
import { useEffect, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

export const TextInput = ({ value = "", type = "text", placeholder = "", onInput, label, description, ...rest }) => {
  const [input, setInput] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    onInput(input);
  }, [input]);

  return (
    <Field className="flex flex-col gap-0.5">
      {label && <Label>{label}</Label>}

      <div className="flex rounded-md border border-gray-300 px-4 py-2 transition-colors focus-within:border-blue focus:outline-none">
        <Input
          ref={ref}
          value={input}
          type={type}
          placeholder={placeholder}
          onInput={(e) => {
            setInput(e?.target?.value);
          }}
          {...rest}
          className="flex-1 focus:outline-none"
        />

        <button
          className={twJoin("rounded-full text-xl", input?.length === 0 && "invisible pointer-events-none")}
          onClick={() => {
            setInput("");
            ref.current?.focus();
          }}
        >
          <FontAwesomeIcon icon={faXmarkCircle} />
        </button>
      </div>

      {description && <Description className="text-sm text-gray-500">{description}</Description>}
    </Field>
  );
};

TextInput.propTypes = {
  /**
   * Sets the initial value of the TextInput
   */
  value: PropTypes.string,
  type: PropTypes.oneOf(["text", "password"]),
  placeholder: PropTypes.string,
  onInput: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.string,
};
