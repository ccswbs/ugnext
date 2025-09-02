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
                    Cut-off ranges are estimates based on past years. Actual cut-offs depend on the number and strength
                    of applicants and available space. Meeting the range does not guarantee admission.
                  </Typography>

                  {program.type.some((type) => type.name === "Co-op") && (
                    <Typography type="body" as="p" className="italic">
                      Co-op cut-offs are usually higher. If you don’t qualify, you’ll be considered for the regular
                      program.
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
