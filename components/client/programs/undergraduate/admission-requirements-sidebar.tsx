"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@uoguelph/react-components/button";
import { tv } from "tailwind-variants";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import type {
  UndergraduateAdmissionLocation,
  UndergraduateAdmissionRequirementSidebar,
  UndergraduateAdmissionStudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import { faArrowLeftFromBracket, faCircleInfo } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import React from "react";
import type { UndergraduateProgram } from "@/data/drupal/undergraduate-program";

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

type AdmissionRequirementsSidebarProps = {
  studentType?: UndergraduateAdmissionStudentType;
  location?: UndergraduateAdmissionLocation;
  program?: UndergraduateProgram;
  sidebar: UndergraduateAdmissionRequirementSidebar;
};

export function AdmissionRequirementsSidebar({
  sidebar,
  program,
  studentType,
  location,
}: AdmissionRequirementsSidebarProps) {
  return (
    <div className="flex flex-col gap-4 mt-7.5">
      {(program || studentType || location) && (
        <AdmissionRequirementsSidebarButton
          url="/programs/undergraduate/requirements"
          title="View Other Requirements"
          icon={faArrowLeftFromBracket}
        />
      )}

      {sidebar?.map((button) => (
        <AdmissionRequirementsSidebarButton
          key={button.id}
          color={button.link.title === "Apply Now!" ? "red" : "black"}
          url={button.link.url ?? ""}
          title={button.link.title ?? ""}
          icon={button.fontAwesomeIcon ?? ""}
        />
      ))}

      {program && (
        <AdmissionRequirementsSidebarButton
          key={program.id}
          color="black"
          url={program.url.url ?? ""}
          title={`Learn more about ${program.title}`}
          icon={faCircleInfo}
        />
      )}
    </div>
  );
}
