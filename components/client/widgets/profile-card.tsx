"use client";

import React from "react";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import { LdapContactInfoClient } from "@/components/client/ldap-contact-info-client";

interface ProfileCardData {
  __typename?: "ParagraphProfileCard";
  id?: string;
  profileInfo?: {
    __typename?: "NodeProfile";
    id: string;
    title: string;
    centralLoginId: string;
    directoryEmail: boolean;
    directoryOffice: boolean;
    directoryPhone: boolean;
    profileJobTitle?: string;
    path?: string;
    customLink?: Array<{
      title: string;
      url: string;
    }>;
    profilePicture?: {
      __typename?: "MediaImage";
      image: {
        alt?: string;
        url: string;
      };
    };
  };
}

interface ProfileCardWithApiProps {
  data: ProfileCardData;
}

export const ProfileCardWithApi = ({ data }: ProfileCardWithApiProps) => {
  const { profileInfo } = data;
  
  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error('ProfileCard: profileInfo is undefined. Full data object:', data);
    return <div>Profile data not available - missing profileInfo</div>;
  }

  return (
    <Card
      id={`profile-card-${data.id || 'unknown'}`}
      key={data.id || 'unknown'}
      as={profileInfo.path ? Link : 'div'}
      href={profileInfo.path || undefined}
      className="flex flex-col h-full"
      centered
    >
      {profileInfo.profilePicture && (
        <CardImage
          src={profileInfo.profilePicture.image.url}
          alt={profileInfo.profilePicture.image.alt ?? ""}
          width="400"
          height="400"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          className="aspect-square object-cover object-top w-full"
        />
      )}
      <CardContent>
        <CardTitle>{profileInfo.title}</CardTitle>
        <p className='text-center'>{profileInfo.profileJobTitle}</p>
        
        {/* Directory contact info from LDAP - using reusable component */}
        <LdapContactInfoClient 
          centralLoginId={profileInfo.centralLoginId}
          directoryEmail={profileInfo.directoryEmail}
          directoryOffice={profileInfo.directoryOffice}
          directoryPhone={profileInfo.directoryPhone}
        />
      </CardContent>
    </Card>
  );
}
