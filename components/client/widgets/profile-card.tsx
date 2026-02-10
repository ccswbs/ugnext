"use client";

import React from "react";
import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl, getDisplayText } from "@/lib/ug-utils";
import { HtmlParser } from "@/components/client/html-parser";
import { ContactEmail, ContactPhone } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileCardFragment } from "@/lib/graphql/types";

export const ProfileCard = ({ data, inMultiColumn = false }: { data: ProfileCardFragment; inMultiColumn?: boolean }) => {
  const { profileInfo } = data;

  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error("ProfileCard: profileInfo is undefined. Full data object:", data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  const sharedClassName = inMultiColumn 
    ? `block overflow-hidden h-full w-full break-inside-avoid` 
    : `block overflow-hidden h-full xl:w-[calc(45%-0.75rem)] xl:inline-block xl:align-top xl:mr-3 xl:mb-4`;

  const content = (
    <div className="flex flex-col md:flex-row h-full md:items-start">
    
      {/* Image Section */}
      {profileInfo.profilePicture && (
        <div className="shrink-0 w-full md:w-48 lg:w-56 xl:w-1/3 aspect-square max-w-xs md:max-w-none">
          <Image
            src={profileInfo.profilePicture.image.url}
            alt={profileInfo.profilePicture.image.alt ?? ""}
            width={400}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 50vw"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 md:px-6 flex flex-col justify-start">
        
        {profileInfo.title && (
          <Typography type="h3" as="h3" className="md:mt-0">
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
            directoryOffice={!!profileInfo.directoryOffice}
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
                    {link.url.startsWith("mailto:") ? (
                      <ContactEmail email={link.url.replace("mailto:", "")} />
                    ) : link.url.startsWith("tel:") ? (
                      <ContactPhone number={link.url.replace("tel:", "")} />
                    ) : (
                      <>
                        <i className={`${getIconForUrl(link.url)} me-2`} aria-hidden="true"></i>
                        <Link href={link.url}>                      
                          {link.title}
                        </Link>
                      </>
                    )}
                  </div>
                )
            )}
          </div>
        )}
        
        {/* {profileInfo.path && (
          <Link href={profileInfo.path} className="block">
            View full profile
          </Link>
        )} */}

      </div>
    </div>
  );

  return (
    <div className="xl:after:content-[''] xl:after:display-table xl:after:clear-both">
      <div className={sharedClassName}>{content}</div>
    </div>
  );
};
