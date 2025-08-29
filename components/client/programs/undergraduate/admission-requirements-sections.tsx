"use client";

import type {
  UndergraduateAdmissionLocation,
  UndergraduateAdmissionRequirementSection,
  UndergraduateAdmissionStudentType,
} from "@/data/drupal/undergraduate-admission-requirements";
import type { UndergraduateProgram } from "@/data/drupal/undergraduate-program";
import { Typography } from "@uoguelph/react-components/typography";
import { HtmlParser } from "@/components/client/html-parser";
import React, { Fragment } from "react";
import { List } from "@uoguelph/react-components/list";
import { nanoid } from "nanoid";
import { ElementType } from "domelementtype";
import { Link } from "@uoguelph/react-components/link";

type AdmissionRequirementsSectionsProps = {
  studentType: UndergraduateAdmissionStudentType;
  location: UndergraduateAdmissionLocation;
  program: UndergraduateProgram;
  sections: UndergraduateAdmissionRequirementSection[];
};

export function AdmissionRequirementsSections({
  studentType,
  location,
  program,
  sections,
}: AdmissionRequirementsSectionsProps) {
  return (
    <>
      {program.type.some((type) => type.name === "Co-op") && (
        <Typography type="body" as="span" className="block! italic">
          This program is offered with and without{" "}
          <Link href="/experiential-learning/future-students/co-op-programs">co-op</Link>.
        </Typography>
      )}

      {sections
        ?.map((section) => {
          if (!section.content) {
            return null;
          }

          return (
            <Fragment key={section.title}>
              <Typography type="h3" as="h2">
                {section.title}
              </Typography>

              <HtmlParser
                html={section.content}
                instructions={[
                  {
                    shouldProcessNode: (node) => node.tagName === "ul" || node.tagName === "ol",
                    processNode: (node, props, children, index, childParser) => {
                      // Merge lists that are next to each other
                      const tag = node.tagName;

                      if (node.previousSibling?.type === ElementType.Tag && node.previousSibling.tagName === tag) {
                        return <></>;
                      }

                      const neighboringLists = [];
                      let current = node.nextSibling;

                      while (current?.type === ElementType.Tag && current.tagName === tag) {
                        neighboringLists.push(...current.children);
                        current = current.nextSibling;
                      }

                      return (
                        <List {...props} key={nanoid()} as={tag as "ul" | "ol"}>
                          {children}
                          {
                            // @ts-ignore
                            childParser(neighboringLists as Element[])
                          }
                        </List>
                      );
                    },
                  },
                ]}
              />

              {section.title === "Estimated Cut-off Range" && section.content !== "" && (
                <>
                  <Typography type="body" as="p" className="italic">
                    Estimated cutoff ranges are based on admission averages from previous years and are provided as a
                    point of reference. Exact cut-offs are determined by the quantity and quality of applications
                    received and the space available in the program. Having an average within this range does not
                    guarantee admission.
                  </Typography>

                  {program.type.some((type) => type.name === "Co-op") && (
                    <Typography type="body" as="p" className="italic">
                      If you are applying for co-op, note that co-op averages will often exceed the estimated cut-off
                      ranges. Students not admissible to co-op will be automatically considered for the regular program.
                    </Typography>
                  )}
                </>
              )}
            </Fragment>
          );
        })
        .filter((section) => section !== null)}
    </>
  );
}
