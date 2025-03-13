import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { twJoin } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@awesome.me/kit-7993323d0c/icons/classic/regular";
import PropTypes from "prop-types";

export const Select = ({
  onChange,
  options,
  multiple = false,
  label,
  name,
  description,
  placeholder,
  autocomplete,
}) => {
  const ContainerTag = autocomplete ? Combobox : Listbox;
  const ButtonTag = autocomplete ? ComboboxButton : ListboxButton;
  const OptionsTag = autocomplete ? ComboboxOptions : ListboxOptions;
  const OptionTag = autocomplete ? ComboboxOption : ListboxOption;

  const [selected, setSelected] = useState(
    multiple
      ? (options.filter((option) => option?.selected) ?? [])
      : (options.find((option) => option?.selected) ?? null)
  );

  // Map the indices of each option by their value for faster lookup when sorting the selected options
  const indices = useMemo(
    () => options.reduce((acc, option, index) => acc.set(option?.value, index), new Map()),
    [options]
  );

  const labelText = multiple
    ? selected.reduce((acc, option, index) => `${acc}${option?.label}${index < selected?.length - 1 ? ", " : ""}`, "")
    : selected?.label;

  const placeholderText = placeholder ?? (autocomplete ? "Select or search for a value" : "Select a value");

  const [query, setQuery] = useState("");
  const filteredOptions = useMemo(() => {
    if (multiple) {
      const input = query.trim().split(",");

      // TODO: handle autocomplete for multi select.

      return options;
    }

    if (typeof autocomplete === "function") {
      return autocomplete(query, options);
    }

    return options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
  }, [multiple, autocomplete, options, query]);

  return (
    <Field className="flex flex-col gap-0.5">
      {label && <Label>{label}</Label>}

      <ContainerTag
        name={name}
        value={selected}
        by="value"
        onChange={(options) => {
          // Sort the selected options by their original order as was passed in the options prop
          const selected = multiple
            ? [...options].sort((a, b) => (indices.get(a?.value) ?? 0) - (indices.get(b?.value) ?? 0))
            : options;

          setSelected(selected);
          onChange?.(options);
        }}
        as="div"
        className="group relative"
        multiple={multiple}
      >
        {autocomplete ? (
          <div className="relative flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 shadow-sm transition-colors group-focus-within:border-blue group-focus-within:outline-none ui-open:rounded-b-none ui-open:border-blue">
            <ComboboxInput
              className="h-6 flex-1 focus:outline-none "
              placeholder={placeholderText}
              displayValue={(option) => labelText}
              onChange={(e) => setQuery(e.target.value)}
            />

            <ButtonTag className="absolute left-0 flex w-full items-center justify-end px-4 py-2">
              <FontAwesomeIcon
                className="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180"
                icon={faChevronDown}
              />
            </ButtonTag>
          </div>
        ) : (
          <ButtonTag className="bg-white flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 shadow-sm transition-colors group-focus-within:border-blue group-focus-within:outline-none ui-open:rounded-b-none ui-open:border-blue">
            <span className={twJoin("truncate", (!selected || selected?.length === 0) && "text-gray-400")}>
              {labelText ?? placeholderText}
            </span>

            <FontAwesomeIcon
              className="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180"
              icon={faChevronDown}
            />
          </ButtonTag>
        )}

        <OptionsTag
          transition
          className="z-10 max-h-[20rem] w-full overflow-auto rounded-b-md border border-t-0 border-gray-300 bg-white shadow-md group-focus-within:border-blue group-focus-within:outline-none ui-open:border-blue md:absolute transition duration-300 ease-out data-[closed]:opacity-0"
        >
          {filteredOptions.map((option, index) => (
            <OptionTag
              className="relative cursor-pointer select-none border-b border-gray-300 px-4 py-2 text-gray-900 transition-colors last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ui-active:bg-gray-100"
              key={typeof option?.value === "string" ? option?.value : (option?.key ?? index)}
              value={option}
              disabled={option?.disabled}
            >
              {({ focus, selected }) => (
                <div className="flex">
                  <span className="flex-1">{option?.label}</span>

                  <FontAwesomeIcon
                    icon={faCheck}
                    className={twJoin("h-5 w-5 text-blue-600", selected ? "visible" : "invisible")}
                  />
                </div>
              )}
            </OptionTag>
          ))}
        </OptionsTag>
      </ContainerTag>

      {description && <Description className="text-sm text-gray-500">{description}</Description>}
    </Field>
  );
};

Select.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      key: PropTypes.string,
      disabled: PropTypes.bool,
      selected: PropTypes.bool,
    })
  ).isRequired,
  /**
   * Determines whether to allow the user to select multiple options
   */
  multiple: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  name: PropTypes.string,
  description: PropTypes.string,
  /**
   * Help text to display when the user has not selected any options
   */
  placeholder: PropTypes.string,
  /**
   * Determines whether the Select should act as a search bar which filters the options displayed to the user.
   */
  autocomplete: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};
