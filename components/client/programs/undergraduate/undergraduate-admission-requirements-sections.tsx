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
import { List, ListItem } from "@uoguelph/react-components/list";
import { nanoid } from "nanoid";
import { ElementType } from "domelementtype";
import { Link } from "@uoguelph/react-components/link";

type AdmissionRequirementsSectionsProps = {
  studentType: UndergraduateAdmissionStudentType;
  location: UndergraduateAdmissionLocation;
  program: UndergraduateProgram;
  sections: UndergraduateAdmissionRequirementSection[];
};

export function UndergraduateAdmissionRequirementsSections({
  studentType,
  location,
  program,
  sections,
}: AdmissionRequirementsSectionsProps) {
  const isCoop = program.type.some((type) => type.name === "Co-op");
  const isTransfer = studentType.id === "682" || studentType.id === "681" || studentType.id === "683";
  const isCoopOnly = program.degree?.some((degree) => degree.id === "5218");
  const isHighSchool = studentType.id === "684";

  return (
    <>
      {isCoop && (
        <>
          {isCoopOnly && isHighSchool ? (
            <Typography type="body" as="span" className="block! italic">
              This subject is <Link href="/experiential-learning/future-students/co-op-programs">co-op</Link> admission
              only.
            </Typography>
          ) : (
            <Typography type="body" as="span" className="block! italic">
              This subject is offered with and without{" "}
              <Link href="/experiential-learning/future-students/co-op-programs">co-op</Link>.
            </Typography>
          )}

          {isTransfer && (
            <Typography type="body" as="span" className="block! italic">
              Transfer students are not eligible for direct admission to co-op programs. You{" "}
              <Link href="/future-students/co-op-admission#external-transfer-students">may be eligible to apply</Link>{" "}
              once you start your studies.
            </Typography>
          )}
        </>
      )}

      {Array.isArray(program.degree) && program.degree.length > 1 && (
        <>
          <Typography type="body" as="p" className="block!">
            This subject is offered under multiple degrees:
          </Typography>

          <List>
            {program.degree.map((degree) => (
              <ListItem key={degree.id}>
                {degree.url.url ? <Link href={degree.url.url}>{degree.title}</Link> : degree.title}
              </ListItem>
            ))}
          </List>
        </>
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
                    Estimated cut-off ranges are based on admission averages from previous years and are provided as a
                    point of reference. Exact cut-offs are determined by the quantity and quality of applications
                    received and the space available in the program. Having an average within this range does not
                    guarantee admission
                  </Typography>

                  {isCoop && !isTransfer && (
                    <Typography type="body" as="p" className="italic">
                      Co-op averages will often exceed the estimated cut-off ranges. Students not admissible to co-op
                      will be automatically considered for the regular program.
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
