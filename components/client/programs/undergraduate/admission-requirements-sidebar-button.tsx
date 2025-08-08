"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@uoguelph/react-components/button";
import { tv } from "tailwind-variants";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

export type AdmissionRequirementsSidebarButtonProps = {
  url: string;
  color?: ButtonProps["color"];
  title: string;
  icon: string | IconDefinition;
};

export function AdmissionRequirementsSidebarButton({
  url,
  title,
  icon,
  color,
}: AdmissionRequirementsSidebarButtonProps) {
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
