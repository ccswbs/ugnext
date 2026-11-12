import React from "react";
import { Link } from "@uoguelph/react-components/link";
import { Typography } from "@uoguelph/react-components/typography";
import { slugify } from "@/lib/string-utils";

const RELATED_CONTENT_TYPES: Record<string, string> = {
  NodePage: "Page",
  NodeEvent: "Event",
  NodeNews: "News",
  NodeProfile: "Profile",
};

const DEFAULT_HEADING = "Related Content";
const DEFAULT_HEADING_LEVEL = "h2";
const HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

type HeadingLevel = (typeof HEADING_LEVELS)[number];

// Structural type so any content type's `relatedContent` field can be passed in
export type RelatedContentGroups =
  | ReadonlyArray<{
      contentLabel?: string | null;
      headingLevel?: string | null;
      content?: ReadonlyArray<{ __typename?: string; title?: string | null; path?: string | null }> | null;
    }>
  | null
  | undefined;

export type RelatedLink = { title: string; path: string; type?: string };

export type RelatedGroup = { heading: string; headingLevel: HeadingLevel; links: RelatedLink[] };

export function getRelatedGroups(relatedContent: RelatedContentGroups): RelatedGroup[] {
  return (relatedContent ?? []).flatMap((group) => {
    const links = (group.content ?? []).flatMap(({ __typename, title, path }) =>
      title && path ? [{ title, path, type: __typename ? RELATED_CONTENT_TYPES[__typename] : undefined }] : []
    );

    if (links.length === 0) {
      return [];
    }

    const level = group.headingLevel?.toLowerCase();

    return [
      {
        heading: group.contentLabel?.trim() || DEFAULT_HEADING,
        headingLevel: HEADING_LEVELS.find((l) => l === level) ?? DEFAULT_HEADING_LEVEL,
        links,
      },
    ];
  });
}

export function RelatedContent({ relatedContent }: { relatedContent: RelatedContentGroups }) {
  const groups = getRelatedGroups(relatedContent);

  return (
    <>
      {groups.map(({ heading, headingLevel, links }, index) => (
        <section key={index}>
          <Typography
            id={index === 0 ? slugify(heading) : `${slugify(heading)}-${index}`}
            type={headingLevel}
            as={headingLevel}
          >
            {heading}
          </Typography>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {links.map((related) => (
              <li key={related.path}>
                <Link href={related.path}>{related.title}</Link>
                {related.type && ` (${related.type})`}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
