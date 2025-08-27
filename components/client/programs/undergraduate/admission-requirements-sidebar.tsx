"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@uoguelph/react-components/button";
import { tv } from "tailwind-variants";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import type { UndergraduateAdmissionRequirementSidebar } from "@/data/drupal/undergraduate-admission-requirements";
import { faArrowLeftFromBracket } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import React from "react";

type AdmissionRequirementsSidebarButtonProps = {
  url: string;
  color?: ButtonProps["color"];
  title: string;
  icon: string | IconDefinition;
};

function AdmissionRequirementsSidebarButton({ url, title, icon, color }: AdmissionRequirementsSidebarButtonProps) {
  const classes = tv({
    slots: {
      button: "w-full font-medium flex items-center justify-start! gap-x-1 leading-6 mx-1",
      icon: "pe-3 text-3xl inline-block align-middle",
    },
  })();

  return (
    <Button color={color} className={classes.button()} as={Link} href={url}>
      {typeof icon === "string" ? (
        <i className={`${classes.icon()} ${icon}`} aria-hidden="true"></i>
      ) : (
        <FontAwesomeIcon className={classes.icon()} icon={icon} />
      )}

      <span>{title}</span>
    </Button>
  );
}

export function AdmissionRequirementsSidebar({ sidebar }: { sidebar?: UndergraduateAdmissionRequirementSidebar }) {
  return (
    <div className="flex flex-col gap-4 mt-7.5">
      <AdmissionRequirementsSidebarButton
        url="/programs/undergraduate/requirements"
        title="View Other Requirements"
        icon={faArrowLeftFromBracket}
      />

      {sidebar?.map((button) => (
        <AdmissionRequirementsSidebarButton
          key={button.id}
          color="black"
          url={button.link.url ?? ""}
          title={button.link.title ?? ""}
          icon={button.fontAwesomeIcon ?? ""}
        />
      ))}
    </div>
  );
}
