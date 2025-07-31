"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { UnstyledLink } from "@/components/client/unstyled-link";
import { Fragment } from "react";

type Image = {
  image: {
    url: string;
    alt: string | null;
    width: number;
    height: number;
  };
};

type Profile = {
  id: string;
  title: string;
  path: string;
  profileJobTitle?: string;
  profilePicture?: Image;
  profileFirstName?: string;
  profileLastName?: string;
};

export const ProfileGrid = ({ profiles }: { profiles: Profile[] }) => {
  // Sort profiles by last name alphabetically
  const sortedProfiles = [...profiles].sort((a, b) => {
    const lastNameA = a.profileLastName || '';
    const lastNameB = b.profileLastName || '';
    return lastNameA.localeCompare(lastNameB);
  });

  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {sortedProfiles.map(profile => (
        <Card
          id={`profile-card-${profile.id}`}
          key={profile.id}
          as={UnstyledLink}
          href={profile.path}
          className="flex flex-col h-full"
          centered
        >
          {profile.profilePicture && (
            <CardImage
              src={profile.profilePicture.image.url}
              alt={profile.profilePicture.image.alt ?? ""}
              width={profile.profilePicture.image.width.toString()}
              height={profile.profilePicture.image.height.toString()}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              className="aspect-square object-cover object-top w-full"
            />
          )}
          <CardContent>
            <CardTitle>{profile.title}</CardTitle>
            <p className='text-center'>{profile.profileJobTitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
