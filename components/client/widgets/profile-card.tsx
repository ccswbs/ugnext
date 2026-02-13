"use client";

import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl } from "@/lib/ug-utils";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
import { Typography } from "@uoguelph/react-components/typography";
import type { ProfileCardFragment } from "@/lib/graphql/types";

export const ProfileCard = ({ data }: { data: ProfileCardFragment }) => {
  const { profileInfo } = data;

  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error("ProfileCard: profileInfo is undefined. Full data object:", data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  // Determine if profile picture and link to full profile should be shown
  // These fields will be added to the Profile Card widget configuration (not the Profile content type)
  // Default to true (show picture) if the field is undefined for backward compatibility
  const shouldShowProfilePicture = (data as any).showProfilePicture !== false;
  const shouldShowProfileLink = (data as any).showProfileLink === true;

  const sharedClassName = `inline-block overflow-hidden h-full w-full max-w-[475px] align-top mx-2 mb-4 ${!shouldShowProfilePicture ? 'bg-grey-light-bg py-4' : ''}`;

  const content = (
    <div className="flex flex-col md:flex-row h-full md:items-start">
    
      {/* Image Section - now conditionally rendered based on shouldShowProfilePicture */}
      {profileInfo.profilePicture && shouldShowProfilePicture && (
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
      <div className="flex-1 md:px-4 flex flex-col justify-start">
        
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
        
        {profileInfo.path && shouldShowProfileLink && (
          <Link href={profileInfo.path} className="block">
            View full profile
          </Link>
        )}

      </div>
    </div>
  );

  return (
    <div className={sharedClassName}>{content}</div>
  );
};
