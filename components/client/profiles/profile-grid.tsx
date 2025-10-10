"use client";

import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import { FullProfile } from "@/lib/types/profile";

type ProfileGridProps = {
  profiles: FullProfile[];
  gridClasses?: string;
  isLoading?: boolean;
  // Pagination props
  totalResults?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export const ProfileGrid = ({ 
  profiles, 
  gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  isLoading = false,
  totalResults,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false
}: ProfileGridProps) => {
  // Sort profiles by last name alphabetically
  const sortedProfiles = [...profiles].sort((a, b) => {
    const lastNameA = a.profileLastName || '';
    const lastNameB = b.profileLastName || '';
    return lastNameA.localeCompare(lastNameB);
  });

  const renderLoadingCard = (index: number) => (
    <div key={`loading-${index}`} className="bg-white border rounded-lg shadow-sm overflow-hidden animate-pulse flex flex-col h-full">
      <div className="w-full aspect-square bg-gray-200"></div>
      <div className="p-4 flex-grow flex flex-col justify-center">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );

  // If loading, show skeleton cards
  if (isLoading) {
    const loadingCards = Array.from({ length: 20 }, (_, index) => renderLoadingCard(index));
    
    return (
      <div className={`mt-3 grid ${gridClasses} gap-6`}>
        {loadingCards}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Results count */}
      {totalResults !== undefined && !isLoading && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {sortedProfiles.length} of {totalResults} results
        </div>
      )}

      {/* Profile grid */}
      <div className={`mt-3 grid ${gridClasses} gap-6`}>
        {sortedProfiles.map(profile => (
          <Card
            key={profile.id}
            id={`profile-card-${profile.id}`}
            as={Link}
            href={profile.path || '#'}
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
        ))}
      </div>

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-yellow text-black font-semibold rounded-lg hover:bg-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                Loading more...
              </>
            ) : (
              'Load More Results'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
