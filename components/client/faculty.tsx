"use client";

import type { Image } from './media';
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { UnstyledLink } from "@/components/client/unstyled-link";
import { Typography } from "@uoguelph/react-components/typography";
import { Container } from "@uoguelph/react-components/container";
import { PeopleSearchNavigation } from "@/components/client/people/people-search-navigation";

type Profile = {
  id: string;
  title: string;
  path: string;
  profileJobTitle?: string;
  profilePicture?: Image;
};

export default function FacultyList({ profiles }: { profiles: Profile[] }) {
  if (!profiles) return <div>No profiles found.</div>;

  return (
    <div className="flex flex-col relative">
      <Container className="py-0!">
          <PeopleSearchNavigation />
      </Container>

    {/*<PeopleSearchBar
        profiles={profiles}
        types={types}
        units={units}
        onChange={handleFilterChange}
    />*/}

      <Container>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                
        {/* No results were found 
        {filteredPeople?.length === 0 && (
          <div className="flex w-full items-center justify-center">
            <span className="text-xl font-bold text-black/50">No people matching your criteria were found.</span>
          </div>
        )}*/}
        </div>  
      </Container>
    </div>
  );
}