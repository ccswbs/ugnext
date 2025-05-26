import React from "react";
import { Tab, TabGroup, TabPanel, TabPanels, TabList } from "@headlessui/react";
import { twJoin } from "tailwind-merge";
import PropTypes from "prop-types";

export const Tabs = ({ fullWidth = true, tabs }) => (
  <TabGroup>
    <TabList className={twJoin("flex gap-1 border-b-4 border-uog-color-yellow", fullWidth ? "w-full" : "w-fit")}>
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          className={twJoin(
            "mb-1 rounded-t-sm bg-uog-color-grey-light-bg px-4 py-3 text-lg font-bold text-black transition-colors hover:bg-uog-color-grey-light focus:bg-uog-color-grey-light focus:outline-hidden ui-selected:mb-0 ui-selected:border-2 ui-selected:border-uog-color-yellow ui-selected:bg-uog-color-yellow",
            fullWidth && "flex-1"
          )}
        >
          {tab?.title}
        </Tab>
      ))}
    </TabList>
    <TabPanels>
      {tabs.map((tab, index) => (
        <TabPanel key={index} className="py-4">
          {tab?.content}
        </TabPanel>
      ))}
    </TabPanels>
  </TabGroup>
);

Tabs.propTypes = {
  /**
   * Determines whether the tabs will take up the full width of its container
   */
  fullWidth: PropTypes.bool,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};
