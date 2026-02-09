"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl, getDisplayText } from "@/lib/ug-utils";
import { HtmlParser } from "@/components/client/html-parser";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileCardFragment } from "@/lib/graphql/types";

export const ProfileCard = ({ data }: { data: ProfileCardFragment }) => {
  const { profileInfo } = data;

  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error("ProfileCard: profileInfo is undefined. Full data object:", data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  const sharedClassName =
    `${profileInfo.path ? 'group ' : ''}block bg-grey-light-bg overflow-hidden h-full xl:w-[calc(45%-0.75rem)] xl:inline-block xl:align-top xl:mr-3 xl:mb-4`;

  const content = (
    <div className="flex flex-col md:flex-row h-full">
      {/* Image Section */}
      {profileInfo.profilePicture && (
        <div className="shrink-0 w-full md:w-48 lg:w-56 xl:w-1/3">
          {profileInfo.path ? (
            <Link href={profileInfo.path} className="block">
              <Image
                src={profileInfo.profilePicture.image.url}
                alt={profileInfo.profilePicture.image.alt ?? ""}
                width={400}
                height={400}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 50vw"
                className="aspect-square object-cover object-top w-full h-full md:h-full transition-transform duration-200 ease-in-out group-hover:scale-110"
              />
            </Link>
          ) : (
            <Image
              src={profileInfo.profilePicture.image.url}
              alt={profileInfo.profilePicture.image.alt ?? ""}
              width={400}
              height={400}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 50vw"
              className="aspect-square object-cover object-top w-full h-full md:h-full"
            />
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        {profileInfo.path ? (
          <Link href={profileInfo.path} className="block">
            <Typography type="h3" as="p" className="m-0 hover:bg-yellow transition-colors duration-200">
              {profileInfo.title}
            </Typography>
          </Link>
        ) : (
          <Typography type="h3" as="p" className="m-0">
            {profileInfo.title}
          </Typography>
        )}
        {profileInfo.profileJobTitle && (
          <Typography type="h5" as="p" className="m-0">
            {profileInfo.profileJobTitle}
          </Typography>
        )}

        {/* Directory contact info from AAD - using secure public API */}
        {profileInfo.centralLoginId && (
          <PublicContactInfo
            email={`${profileInfo.centralLoginId}@uoguelph.ca`}
            directoryEmail={!!profileInfo.directoryEmail}
            directoryOffice={false}
            directoryPhone={!!profileInfo.directoryPhone}
            className="mt-2"
          />
        )}

        {/* Custom links if available */}
        {profileInfo.customLink && profileInfo.customLink.length > 0 && (
          <div className="mb-4">
            {profileInfo.customLink.map(
              (link, idx) =>
                link.url && (
                  <div key={idx}>
                    <Link href={link.url} className="flex items-center gap-2">
                      <i className={`${getIconForUrl(link.url)} w-4`} aria-hidden="true"></i>
                      <span className="text-body-copy-link underline hover:decoration-transparent">{link.title}</span>
                    </Link>
                  </div>
                )
            )}
          </div>
        )}

        {/* Profile Fields 
        {profileInfo.profileFields && profileInfo.profileFields.length > 0 && (
          <div className="mt-2">
            {profileInfo.profileFields.map((field, index) => (
              <div key={index}>
                <HtmlParser html={getDisplayText(field.label)} instructions={undefined} />
                <HtmlParser html={getDisplayText(field.value)} instructions={undefined} />
              </div>
            ))}
          </div>
        )}*/}
      </div>
    </div>
  );

  return (
    <div className="xl:after:content-[''] xl:after:display-table xl:after:clear-both">
      <div className={sharedClassName}>{content}</div>
    </div>
  );
};
