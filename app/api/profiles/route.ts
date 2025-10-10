import { NextRequest, NextResponse } from "next/server";
import { getProfilesPaginated, getProfilesByTypeName, getProfilesByUnit } from "@/data/drupal/profile";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const searchTerm = searchParams.get('search') || undefined;
    
    // Get filter parameters
    const profileTypes = searchParams.getAll('types');
    const units = searchParams.getAll('units');
    const researchAreas = searchParams.getAll('research');
    let result;

    // If no filters are specified, use the general paginated query
    if (profileTypes.length === 0 && units.length === 0 && researchAreas.length === 0) {
      result = await getProfilesPaginated(page, pageSize, searchTerm);
    } else {
      // Handle filtered queries with memory-efficient approach
      // For now, we'll handle simple cases efficiently and complex cases with limited scope
      
      if (units.length === 1 && profileTypes.length === 0 && researchAreas.length === 0) {
        // Simple unit-only filtering - use direct pagination
        const unitId = units[0];
        const unitProfiles = await getProfilesByUnit(unitId, page, pageSize);
        
        // Apply search term if provided
        let filteredProfiles = unitProfiles;
        if (searchTerm && searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase().trim();
          filteredProfiles = unitProfiles.filter(profile => {
            const searchableText = [
              profile.title,
              profile.profileFirstName,
              profile.profileLastName,
              profile.profileJobTitle,
              ...(profile.profileResearchAreas?.map((area: any) => area.name) || [])
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchLower);
          });
        }
        
        result = {
          results: filteredProfiles,
          total: filteredProfiles.length, // We don't know the true total, just return what we have
          pageInfo: {
            total: filteredProfiles.length,
            pageSize: pageSize,
            page: page,
            hasNextPage: filteredProfiles.length === pageSize // If we got a full page, assume there might be more
          }
        };
        
      } else if (profileTypes.length === 1 && units.length === 0 && researchAreas.length === 0) {
        // Simple type-only filtering - use direct pagination
        const profileType = profileTypes[0];
        const typeProfiles = await getProfilesByTypeName(profileType, page, pageSize);
        
        // Apply search term if provided
        let filteredProfiles = typeProfiles;
        if (searchTerm && searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase().trim();
          filteredProfiles = typeProfiles.filter(profile => {
            const searchableText = [
              profile.title,
              profile.profileFirstName,
              profile.profileLastName,
              profile.profileJobTitle,
              ...(profile.profileResearchAreas?.map((area: any) => area.name) || [])
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchLower);
          });
        }
        
        result = {
          results: filteredProfiles,
          total: filteredProfiles.length,
          pageInfo: {
            total: filteredProfiles.length,
            pageSize: pageSize,
            page: page,
            hasNextPage: filteredProfiles.length === pageSize
          }
        };
        
      } else {
        // Complex filtering - keep it simple to avoid memory issues
        let allProfiles: any[] = [];

        // Fetch by profile types with limited scope
        if (profileTypes.length > 0) {
          const typePromises = profileTypes.map(type => getProfilesByTypeName(type, page, pageSize));
          const typeResults = await Promise.all(typePromises);
          allProfiles = typeResults.flat();
        }

        // Fetch by units with limited scope
        if (units.length > 0) {
          const unitPromises = units.map(unitId => getProfilesByUnit(unitId, page, pageSize));
          const unitResults = await Promise.all(unitPromises);
          const unitProfiles = unitResults.flat();
          
          if (allProfiles.length === 0) {
            allProfiles = unitProfiles;
          } else {
            // Intersect: only profiles that match both type and unit criteria
            const unitProfileIds = new Set(unitProfiles.map(p => p.id));
            allProfiles = allProfiles.filter(p => unitProfileIds.has(p.id));
          }
        }

        // Apply search term if provided
        if (searchTerm && searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase().trim();
          allProfiles = allProfiles.filter(profile => {
            const searchableText = [
              profile.title,
              profile.profileFirstName,
              profile.profileLastName,
              profile.profileJobTitle,
              ...(profile.profileResearchAreas?.map((area: any) => area.name) || [])
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchLower);
          });
        }

        // Deduplicate by ID
        const uniqueProfiles = new Map();
        allProfiles.forEach(profile => {
          if (profile.id && !uniqueProfiles.has(profile.id)) {
            uniqueProfiles.set(profile.id, profile);
          }
        });
        
        const finalProfiles = Array.from(uniqueProfiles.values());

        result = {
          results: finalProfiles,
          total: finalProfiles.length,
          pageInfo: {
            total: finalProfiles.length,
            pageSize: pageSize,
            page: page,
            hasNextPage: finalProfiles.length === pageSize
          }
        };
      }
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in profiles API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' }, 
      { status: 500 }
    );
  }
}