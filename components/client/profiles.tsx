'use client';

import useSWR from 'swr';
import type { Image } from './media';
import { Typography } from "@uoguelph/react-components/typography";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { UnstyledLink } from "@/components/client/unstyled-link";
import { Fragment } from "react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type Profile = {
    id: string;
    title: string;
    path: string;
    profileJobTitle?: string;
    profileType?: { name: string };
    profilePicture?: Image;
};

type ProfilesListProps = {
  unit?: string;  
  profileType?: string;
};

export default function ProfilesList({ unit, profileType }: ProfilesListProps) {
  let query = [];
  if (unit) query.push(`unit=${encodeURIComponent(unit)}`);
  if (profileType) query.push(`profileType=${encodeURIComponent(profileType)}`);
  const queryString = query.length ? `?${query.join('&')}` : '';

  const { data: profiles, error, isLoading } = useSWR<Profile[]>(
    `/api/profiles${queryString}`,
    fetcher
  );

  if (isLoading) return <p>Loading profiles...</p>;
  if (error) return <p>Failed to load profiles.</p>;
  if (!profiles || profiles.length === 0) return <p>No profiles found.</p>;

  // Group profiles by profileType.name (including "Other" for missing types)
  const grouped = profiles.reduce<Record<string, Profile[]>>((acc, profile) => {
    const type = profile.profileType?.name?.trim() || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(profile);
    return acc;
  }, {});

  return (
    <div>
      <Typography type="h2" as="h2">
        {unit ? unit : profileType ? profileType : "Profiles"}
      </Typography>
      {Object.entries(grouped).map(([typeName, group]) => (
        <Fragment key={typeName}>
          <Typography type="h3" as="h3" className="mt-8 mb-4">
            {typeName}
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {group.map((profile, index) => (
              <Card
                id={`profile-card-${index}`}
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
        </Fragment>
      ))}
    </div>
  );
}


