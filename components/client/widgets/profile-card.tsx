"use client";

import Image from "next/image";
import { PublicContactInfo } from "@/components/client/public-contact-info";
import { getIconForUrl } from "@/lib/ug-utils";
import { Contact, ContactEmail, ContactName, ContactPhone, ContactTitle } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
import { Typography } from "@uoguelph/react-components/typography";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import type { ProfileCardFragment } from "@/lib/graphql/types";
import defaultImage from "@/img/university-of-guelph-logo.png";

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

  return (
    <Card key={profileInfo.id} className="@xl:w-100 @xl:inline-block @xl:me-5 mb-5">
      {/* Image Section - now conditionally rendered based on shouldShowProfilePicture */}
      {profileInfo.profilePicture && shouldShowProfilePicture && (
        <CardImage
          as={Image}
          src={profileInfo.profilePicture.image.url}
          alt={profileInfo.profilePicture.image.alt ?? ""}
          width={`${profileInfo.profilePicture.image.variations?.[0]?.width ?? defaultImage.width}`}
          height={`${profileInfo.profilePicture.image.variations?.[0]?.height ?? defaultImage.height}`}
          className="aspect-square object-cover object-center"        
        />
      )}

      <CardContent>
        {profileInfo.title && (
          <CardTitle className="@lg:mt-0">
            {profileInfo.title}
          </CardTitle>
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
      </CardContent>
    </Card>
  );
};
