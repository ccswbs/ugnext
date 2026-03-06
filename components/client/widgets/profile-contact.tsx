"use client";

import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl } from "@/lib/ug-utils";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
//import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileCardFragment } from "@/lib/graphql/types";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import type { SectionContextType } from "@/lib/types/section-context";
import { parsePhoneNumber, parseTelUrl } from "@/lib/string-utils";
import defaultImage from "@/img/university-of-guelph-logo.png";
import { parse } from "path";

export const ProfileContact = ({ data }: { data: ProfileCardFragment }) => {
  const { profileInfo } = data;

  // Check if this is a secondary column using SectionContext - if so, omit the profile picture
  const sectionContext = useContext(SectionContext) as SectionContextType | null;
  const isSecondary = sectionContext?.column === "secondary";

  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error("ProfileCard: profileInfo is undefined. Full data object:", data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  const shouldShowProfileLink = (data as any).showProfileLink === true;

  return (
    <Contact key={profileInfo.id} className="@xl:w-[47%] @xl:inline-block @xl:align-top @xl:me-5 @xl:p-0 my-5">
      <div className="@xl:grid @xl:grid-cols-[1fr_2fr] @xl:gap-4 @xl:bg-white">
        {/* Image Section - conditionally rendered based on section column */}
        {!isSecondary && (
          <div className="-mx-4 -mt-4 mb-4 @xl:m-0">
            <Image
              src={profileInfo.profilePicture?.image?.url ?? defaultImage.src}
              alt={profileInfo.profilePicture?.image?.alt ?? ""}
              width={profileInfo.profilePicture?.image?.width ?? defaultImage.width}
              height={profileInfo.profilePicture?.image?.height ?? defaultImage.height}
              className="aspect-square object-cover object-center"           
            />
          </div>
        )}
        
        <div>
        {profileInfo.title && (
          <ContactName className="@xl:mt-0 @xl:text-2xl">
            {profileInfo.title}
          </ContactName>
        )}
      
        {profileInfo.profileJobTitle && (
          <ContactTitle className="block mb-2">
            {profileInfo.profileJobTitle}
          </ContactTitle>
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

        {/* Custom links if available - mailto/tel links are exempt from count limit */} 
        {profileInfo.customLink && profileInfo.customLink.length > 0 && (
          <div>
            {(() => {
              // Separate mailto/tel links from other custom links
              const mailTelLinks = profileInfo.customLink.filter(link => 
                link.url && (link.url.startsWith("mailto:") || link.url.startsWith("tel:"))
              );
              const otherLinks = profileInfo.customLink.filter(link => 
                link.url && !link.url.startsWith("mailto:") && !link.url.startsWith("tel:")
              );
              
              // Determine limit for non-mailto/tel links
              const otherLinksLimit = isSecondary && !shouldShowProfileLink ? 1 : 3;
              const linksToRender = [...mailTelLinks, ...otherLinks.slice(0, otherLinksLimit)];
              
              return linksToRender.map((link, idx) =>
                link.url && (
                  <div key={idx}>
                    {link.url.startsWith("mailto:") ? (
                      <ContactEmail email={link.url.replace("mailto:", "")} />
                    ) : link.url.startsWith("tel:") ? (
                      (() => {
                        const { number, extension } = parseTelUrl(link.url);
                        return <ContactPhone number={number} extension={extension} />;
                      })()
                    ) : (
                      <div className="flex items-center gap-2">
                        <i className={`${getIconForUrl(link.url)} fa-fw shrink-0`} aria-hidden="true"></i>
                        <Link href={link.url} className="min-w-0 break-words">                      
                          {link.title}
                        </Link>
                      </div>
                    )}
                  </div>
                )
              );
            })()}
          </div>
        )}

        {/* Profile link - show if enabled and not in secondary column, even without custom links */}
        {profileInfo.path && shouldShowProfileLink && (
          <div className="mt-0 mb-4">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-user fa-fw shrink-0" aria-hidden="true"></i>
              <Link href={profileInfo.path}>                      
                {profileInfo.profileFirstName.trim()}'s full profile
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </Contact>
  );
};
