'use client';

import useSWR from 'swr';
import type { Image } from './media';
import { Typography } from "@uoguelph/react-components/typography";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type Profile = {
    id: string;
    title: string;
    path: string;
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

  return (
    <div>
      <Typography type="h2" as="h2">
        {unit ? unit : profileType ? profileType : "Profiles"}
      </Typography>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {profiles.map((profile) => (
          <li key={profile.id} className="bg-white rounded shadow p-4 flex flex-col items-start">
            {profile.profilePicture && (
              <div className="w-full aspect-square mb-2 overflow-hidden">
                <img
                  alt={profile.profilePicture.image.alt ?? ""}
                  src={profile.profilePicture.image.url}
                  className="w-full h-full object-cover object-top"
                  height={profile.profilePicture.image.height}
                  width={profile.profilePicture.image.width}
                />
              </div>
            )}
            <Typography type="h3" as="h3">{profile.title}</Typography>
            {/*profile.profileType?.name && <p className="mb-1">Type: {profile.profileType.name}</p>*/}
            {profile.path && (
              <p className="mb-1">
                <a href={profile.path} className="text-body-copy-link">View profile</a>
              </p>
            )}
            
          </li>
        ))}
      </ul>
    </div>
  );
}


