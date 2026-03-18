"use client";

import React from "react";
import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl } from "@/lib/ug-utils";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
import type { ProfileCardFragment } from "@/lib/graphql/types";
import { useContext } from "react";
import { SectionContext } from "@/components/client/section";
import type { SectionContextType } from "@/lib/types/section-context";
import { parseTelUrl } from "@/lib/string-utils";
import { twJoin } from "tailwind-merge";
import defaultImage from "@/img/university-of-guelph-logo.png";

export const ProfileContact = ({ data }: { data: ProfileCardFragment }) => {
  const { profileInfo } = data;

  // Check section context for column layout decisions
  const sectionContext = useContext(SectionContext) as SectionContextType | null;
  const isSecondary = sectionContext?.column === "secondary";
  const isPrimaryWithSecondary = sectionContext?.column === "primary" && sectionContext?.hasSecondary;
  
  // Determine if we should use grid layout (photo beside text) or stacked layout (photo on top)
  const useGridLayout = !isSecondary && !isPrimaryWithSecondary;

  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error("ProfileCard: profileInfo is undefined. Full data object:", data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  const shouldShowProfileLink = (data as any).showProfileLink === true;

  // Grid wrapper that conditionally applies grid layout
  const GridWrapper = ({ children }: { children: React.ReactNode }) => {
    if (useGridLayout) {
      return <div className="md:grid md:grid-cols-[1fr_2fr] md:gap-4">{children}</div>;
    }
    return <>{children}</>;
  };

  return (
    <div key={profileInfo.id} className={twJoin(
      "my-5",
      !isSecondary && "lg:w-[calc(50%-2rem)] lg:inline-block lg:align-top lg:me-5 lg:p-0"
    )}>
      <GridWrapper>
        {/* Image Section - conditionally rendered based on section column */}
        {!isSecondary && (
          <div className={twJoin(
            "mb-4",
            useGridLayout && "md:m-0"
          )}>
            <Image
              src={profileInfo.profilePicture?.image?.url ?? defaultImage.src}
              alt={profileInfo.profilePicture?.image?.alt ?? ""}
              width={300}
              height={300}
              className="w-full h-auto max-w-[300px] aspect-square object-cover object-center"           
            />
          </div>
        )}
        
        <Contact className={twJoin(
          !isSecondary ? "bg-transparent p-0" : "light"
        )}>
          {profileInfo.title && (
            <ContactName className={twJoin(
              useGridLayout && "md:mt-0 md:text-2xl"
            )}>
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
                    <React.Fragment key={idx}>
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
                    </React.Fragment>
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
                    {profileInfo.profileFirstName?.trim() ? `${profileInfo.profileFirstName.trim()}'s full profile` : "View full profile"}
                  </Link>
                </div>
              </div>
            )}
          </Contact>
        </GridWrapper>
      </div>
  );
};
