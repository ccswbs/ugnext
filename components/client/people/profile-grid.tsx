"use client";

import { Typography } from "@uoguelph/react-components/typography";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
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

type ProfileGridProps = {
  profiles: Profile[];
  gridClasses?: string;
};

export const ProfileGrid = ({ profiles, gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" }: ProfileGridProps) => {
  // Sort profiles by last name alphabetically
  const sortedProfiles = [...profiles].sort((a, b) => {
    const lastNameA = a.profileLastName || '';
    const lastNameB = b.profileLastName || '';
    return lastNameA.localeCompare(lastNameB);
  });

  return (
    <div className={`mt-3 grid ${gridClasses} gap-6`}>
      {sortedProfiles.map(profile => (
        <Card
          id={`profile-card-${profile.id}`}
          key={profile.id}
          as={Link}
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
