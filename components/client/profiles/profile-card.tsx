import type { PartialProfileData } from "@/data/drupal/profile";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@/img/university-of-guelph-logo.png";

export function ProfileCard({ data }: { data: PartialProfileData }) {
  // Check if this profile has AI search match metadata
  const matchedTerms = (data as any)._matchedTerms as string[] || [];
  const hasMatchedTerms = matchedTerms.length > 0;
  
  // Find research areas that match the search terms
  const matchingResearchAreas = hasMatchedTerms && data.profileResearchAreas 
    ? data.profileResearchAreas.filter(area => 
        matchedTerms.some(term => 
          area.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    : [];

  return (
    <Card key={data.id} as={Link} href={data.path ?? ""}>
      <CardImage
        as={Image}
        src={data.profilePicture?.image?.variations?.[0]?.url ?? defaultImage.src}
        alt={data.profilePicture?.image?.alt ?? ""}
        width={`${data.profilePicture?.image?.variations?.[0]?.width ?? defaultImage.width}`}
        height={`${data.profilePicture?.image?.variations?.[0]?.height ?? defaultImage.height}`}
        className="aspect-square object-cover object-center"
      />

      <CardContent>
        <CardTitle>{data.title}</CardTitle>

        {data.profileJobTitle && <span>{data.profileJobTitle}</span>}
        
        {/* Show matching research areas for AI-enhanced search results */}
        {matchingResearchAreas.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-1 font-medium">
              Matching research areas:
            </div>
            <div className="flex flex-wrap gap-1">
              {matchingResearchAreas.slice(0, 3).map((area, index) => (
                <span 
                  key={area.id} 
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {area.name}
                </span>
              ))}
              {matchingResearchAreas.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{matchingResearchAreas.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
