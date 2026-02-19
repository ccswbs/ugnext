"use client";

import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl } from "@/lib/ug-utils";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
//import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileCardFragment } from "@/lib/graphql/types";

export const ProfileContact = ({ data }: { data: ProfileCardFragment }) => {
  const { profileInfo } = data;

  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error("ProfileCard: profileInfo is undefined. Full data object:", data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  // Determine if profile picture and link to full profile should be shown
  // Default to true (show picture) if the field is undefined for backward compatibility
  const shouldShowProfilePicture = (data as any).showProfilePicture !== false;
  const shouldShowProfileLink = (data as any).showProfileLink === true;

  return (
    <Contact key={profileInfo.id} className="@xl:w-[475px] @xl:inline-block @xl:align-top @xl:me-5 @xl:p-0 my-5">
      <div className="@xl:grid @xl:grid-cols-[128px_1fr] @xl:gap-4 @xl:bg-white">
        {/* Image Section - conditionally rendered based on shouldShowProfilePicture */}
        {profileInfo.profilePicture && shouldShowProfilePicture && (
          <div className="@xl:w-32 -mx-4 -mt-4 mb-4 @xl:m-0">
            <Image
              src={profileInfo.profilePicture.image.url}
              alt={profileInfo.profilePicture.image.alt ?? ""}
              width={profileInfo.profilePicture.image.width}
              height={profileInfo.profilePicture.image.height}
              className="aspect-square object-cover object-center"        
            />
          </div>
        )}
        
        <div>
        {profileInfo.title && (
          <ContactName className="@xl:mt-0 text-2xl">
            {profileInfo.title}
          </ContactName>
        )}
      
        {profileInfo.profileJobTitle && (
          <ContactTitle className="block font-bold text-lg mb-2">
            {profileInfo.profileJobTitle}
          </ContactTitle>
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
        
        {profileInfo.path && shouldShowProfileLink && (
          <Link href={profileInfo.path} className="block">
            View full profile
          </Link>
        )}
        </div>
      </div>
    </Contact>
  );
};
