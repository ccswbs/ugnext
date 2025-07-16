//import type { Image } from './media';
import { Typography } from "@uoguelph/react-components/typography";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { UnstyledLink } from "@/components/client/unstyled-link";
import { Fragment } from "react";

export const ProfileGrid = ({ profiles }) => {
  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {profiles.map(profile => (
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
              width={profile.profilePicture.image.width}
              height={profile.profilePicture.image.height}
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
