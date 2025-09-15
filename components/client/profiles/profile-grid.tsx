"use client";

import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { Pagination } from "@uoguelph/react-components/pagination";
import Link from "next/link";
import { useState } from "react";
import { ProfileGridItem } from "@/lib/types/profile";

type ProfileGridProps = {
  profiles: ProfileGridItem[];
  gridClasses?: string;
  itemsPerPage?: number;
};

export const ProfileGrid = ({ 
  profiles, 
  gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  itemsPerPage = 20 
}: ProfileGridProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Sort profiles by last name alphabetically
  const sortedProfiles = [...profiles].sort((a, b) => {
    const lastNameA = a.profileLastName || '';
    const lastNameB = b.profileLastName || '';
    return lastNameA.localeCompare(lastNameB);
  });

  const shouldPaginate = sortedProfiles.length > 20;
  const totalPages = shouldPaginate ? Math.ceil(sortedProfiles.length / itemsPerPage) : 1;
  
  // Get profiles for current page if pagination is enabled
  const displayProfiles = shouldPaginate 
    ? sortedProfiles.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : sortedProfiles;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderProfileCard = (profile: ProfileGridItem) => (
    <Card
      id={`profile-card-${profile.id}`}
      key={profile.id}
      as={Link}
      href={profile.path}
      className="flex flex-col h-full"
      centered
    >
      <CardImage
        src={profile.profilePicture?.image.url ?? "/university-of-guelph-logo.png"}
        alt={profile.profilePicture?.image.alt ?? "University of Guelph Logo"}
        width={(profile.profilePicture?.image.width ?? 200).toString()}
        height={(profile.profilePicture?.image.height ?? 200).toString()}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        className="aspect-square object-cover object-top w-full"
      />
      <CardContent>
        <CardTitle>{profile.title}</CardTitle>
        <p className='text-center'>{profile.profileJobTitle}</p>
      </CardContent>
    </Card>
  );

  if (shouldPaginate) {
    return (
      <div className="flex flex-col py-8">
        <Pagination
          color="yellow"
          count={totalPages}
          visible={5}
          page={currentPage}
          hideInput={false}
          onChange={handlePageChange}
          className="pb-8 pt-0"
        />

        <div className={`mt-3 grid ${gridClasses} gap-6`}>
          {displayProfiles.map(renderProfileCard)}
        </div>

        <Pagination
          color="yellow"
          count={totalPages}
          visible={5}
          page={currentPage}
          hideInput={false}
          onChange={handlePageChange}
          className="pt-8 pb-0"
        />
      </div>
    );
  }

  return (
    <div className={`mt-3 grid ${gridClasses} gap-6`}>
      {displayProfiles.map(renderProfileCard)}
    </div>
  );
};
