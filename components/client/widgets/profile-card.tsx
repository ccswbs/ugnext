"use client";

import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { Container } from "@uoguelph/react-components/container";
import { Typography } from "@uoguelph/react-components/typography";
import Link from "next/link";

interface ProfileCardData {
  __typename?: "ParagraphProfileCard";
  id?: string;
  profileInfo?: {
    __typename?: "NodeProfile";
    id: string;
    title: string;
    directoryEmail: boolean;
    directoryOffice: boolean;
    directoryPhone: boolean;
    profileJobTitle?: string;
    path?: string;
    profilePicture?: {
      __typename?: "MediaImage";
      image: {
        alt?: string;
        url: string;
      };
    };
  };
}

interface ProfileCardProps {
  data: ProfileCardData;
}

export const ProfileCard = ({ data }: ProfileCardProps) => {
  // Add debugging to see what we get after codegen
  console.log('ProfileCard after codegen - received data:', {
    typename: data.__typename,
    id: data.id,
    hasProfileInfo: !!data.profileInfo,
    profileInfo: data.profileInfo,
    allKeys: Object.keys(data)
  });
  
  // Use the profileInfo from the data object with defensive checks
  const { profileInfo } = data;
  
  // Add defensive check to prevent errors if profileInfo is undefined
  if (!profileInfo) {
    console.error('ProfileCard: profileInfo is still undefined after codegen. Full data object:', data);
    return <div>Profile data not available - missing profileInfo (post-codegen)</div>;
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
      </CardContent>
    </Card>
  );
}
