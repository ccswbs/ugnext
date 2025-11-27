import { NextRequest, NextResponse } from "next/server";
import { OramaCloud } from "@orama/core";
import { getFilteredProfiles } from "@/data/drupal/profile";

// Initialize Orama Cloud client with new API
const orama = new OramaCloud({
  projectId: process.env.ORAMA_PROJECT_ID!, // Your Orama project ID
  apiKey: process.env.ORAMA_API_KEY!, // Your Orama API key
});

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const page: number = Math.ceil(parseInt(params.get("page") ?? "0", 10));
  const pageSize: number = Math.ceil(parseInt(params.get("size") ?? "20", 10));
  const queryByName: string = params.get("queryByName") ?? "";
  const queryByResearchArea: string = params.get("queryByResearchArea") ?? "";
  const isAcceptingGraduateStudentsParam = params.get("isAcceptingGraduateStudents");
  const isAcceptingGraduateStudents =
    isAcceptingGraduateStudentsParam === "true" ? true : isAcceptingGraduateStudentsParam === "false" ? false : null;

  const units: string[] = (params.get("units") ?? "")
    .split(",")
    .map((unit) => unit.trim())
    .filter(Boolean);

  const types: string[] = (params.get("types") ?? "")
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);

  console.log("=== NEW VECTOR SEARCH REQUEST ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Query params received:", {
    queryByResearchArea,
    queryByName,
    units,
    types,
    page,
    pageSize
  });

  try {
    // Validate required environment variables
    if (!process.env.ORAMA_PROJECT_ID || !process.env.ORAMA_API_KEY) {
      throw new Error("Orama Cloud credentials not configured. Please set ORAMA_PROJECT_ID and ORAMA_API_KEY environment variables.");
    }

    // Vector search is specifically for research areas only
    if (!queryByResearchArea || !queryByResearchArea.trim()) {
      return NextResponse.json({ 
        error: "Research area query is required for AI-enhanced vector search" 
      }, { status: 400 });
    }

    console.log("=== ORAMA CLIENT DEBUG ===");
    console.log("Project ID:", process.env.ORAMA_PROJECT_ID?.substring(0, 8) + "...");
    console.log("API Key present:", !!process.env.ORAMA_API_KEY);
    console.log("API Key starts with:", process.env.ORAMA_API_KEY?.substring(0, 8) + "...");

    // Create a new Orama client instance for each request to avoid caching
    const freshOrama = new OramaCloud({
      projectId: process.env.ORAMA_PROJECT_ID!,
      apiKey: process.env.ORAMA_API_KEY!,
    });

    // Build search options for Orama Cloud using new API
    const searchOptions: any = {
      term: queryByResearchArea, // Only use research area for vector search
      mode: "vector" as const, // Use vector search mode for semantic search
      similarity: 0.7, // Lower similarity threshold - 0.8 was too restrictive
      limit: pageSize,
      offset: page * pageSize,
      // Add a timestamp to prevent caching issues
      _timestamp: Date.now(),
    };

    console.log("Orama vector search options:", searchOptions);

    // Perform the vector search using new Orama Cloud API
    const searchResults = await freshOrama.search(searchOptions);

    console.log("Orama search results:", searchResults);

    // Log the first document structure to understand the data format
    if (searchResults.hits && searchResults.hits.length > 0) {
      console.log("Sample document structure:", JSON.stringify(searchResults.hits[0].document, null, 2));
    }

    // The Orama index appears to contain research areas/topics, not faculty profiles
    // We need to handle this differently
    const oramaResults = searchResults.hits || [];
    
    console.log(`Orama returned ${oramaResults.length} results for "${queryByResearchArea}"`);
    
    if (oramaResults.length === 0) {
      console.log("No Orama results found - falling back to regular search");
      
      // Fallback: Use regular search when Orama has no results
      try {
        const fallbackResults = await getFilteredProfiles({
          page,
          pageSize,
          queryByName,
          queryByResearchArea, // Use original search term
          units,
          types,
          isAcceptingGraduateStudents,
        });

        console.log("Fallback search results:", fallbackResults.results?.length || 0, "profiles found");

        // Mark this as a fallback search
        const fallbackResponse = {
          ...fallbackResults,
          _fallbackUsed: true,
          _oramaResults: 0,
          _searchType: "regular_fallback",
          _message: `No AI matches found for "${queryByResearchArea}". Showing regular search results.`
        };

        return NextResponse.json(fallbackResponse, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          }
        });
        
      } catch (error) {
        console.error("Fallback search also failed:", error);
        return NextResponse.json({
          results: [],
          totalPages: 0,
          totalItems: 0,
          currentPage: page,
          pageSize: pageSize,
          error: "Both AI and regular search failed",
          _originalQuery: queryByResearchArea
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    }

    // Extract research area terms from Orama results
    const researchTerms = oramaResults.map((hit: any) => hit.document?.name || hit.document?.title).filter(Boolean);
    console.log("Research terms from Orama:", researchTerms);

    // Use the top research terms to search for faculty profiles in your existing database
    // Try different search strategies with better term processing
    const uniqueTerms = [...new Set(researchTerms)]; // Remove duplicates
    console.log("Unique research terms:", uniqueTerms);

    // Generate expanded search terms by breaking down compound terms
    const expandedTerms = new Set();
    
    // Add original terms
    uniqueTerms.forEach(term => expandedTerms.add(term));
    
    // Add individual words from compound terms
    uniqueTerms.forEach(term => {
      const words = term.toLowerCase()
        .split(/[\s\-_,]+/) // Split on space, dash, underscore, comma
        .filter(word => word.length > 2) // Only words longer than 2 characters
        .filter(word => !['and', 'or', 'of', 'the', 'in', 'on', 'at', 'to', 'for', 'with'].includes(word)); // Remove common stop words
      
      words.forEach(word => expandedTerms.add(word));
    });

    const searchTerms = Array.from(expandedTerms).slice(0, 10); // Limit to prevent too many API calls
    console.log("Expanded search terms:", searchTerms);

    let facultyResults;
    
    // Strategy 1: Try individual terms separately and combine results
    console.log("=== FACULTY SEARCH STRATEGIES ===");
    console.log("Strategy 1: Search individual and expanded terms");
    
    const allResults = [];
    const matchedTermsByProfile = new Map(); // Track which terms matched each profile
    
    for (const term of searchTerms) { // Try expanded terms
      try {
        console.log(`Searching for: "${term}"`);
        const termResults = await getFilteredProfiles({
          page: 0,
          pageSize: 50, // Use maximum allowed page size
          queryByName,
          queryByResearchArea: term,
          units,
          types,
          isAcceptingGraduateStudents,
        });
        
        console.log(`"${term}" returned ${termResults.results?.length || 0} results`);
        if (termResults.results && termResults.results.length > 0) {
          // Track which term matched each profile
          termResults.results.forEach(profile => {
            if (!matchedTermsByProfile.has(profile.id)) {
              matchedTermsByProfile.set(profile.id, new Set());
            }
            matchedTermsByProfile.get(profile.id).add(term);
          });
          
          allResults.push(...termResults.results);
        }
      } catch (error) {
        console.log(`Search failed for "${term}":`, error.message);
      }
    }
    
    // Remove duplicate profiles and limit to requested page size
    const uniqueProfiles = allResults.filter((profile, index, arr) => 
      arr.findIndex(p => p.id === profile.id) === index
    );
    
    // Add matched terms to each profile
    const profilesWithMatches = uniqueProfiles.map(profile => ({
      ...profile,
      _matchedTerms: Array.from(matchedTermsByProfile.get(profile.id) || [])
    })).slice(page * pageSize, (page + 1) * pageSize);
    
    console.log(`Combined results: ${allResults.length} total, ${profilesWithMatches.length} unique on this page`);

    if (profilesWithMatches.length > 0) {
      facultyResults = {
        results: profilesWithMatches,
        totalPages: Math.ceil(uniqueProfiles.length / pageSize),
        totalItems: uniqueProfiles.length
      };
    } else {
      // Strategy 2: Try more flexible searching with partial terms
      console.log("Strategy 2: Flexible search with partial matching");
      const flexibleTerms = [];
      
      // Try the original query
      flexibleTerms.push(queryByResearchArea);
      
      // Try just the most relevant keywords from Orama results
      uniqueTerms.forEach(term => {
        // Extract key words from compound terms
        const keywords = term.toLowerCase()
          .replace(/[^\w\s]/g, ' ') // Remove punctuation
          .split(/\s+/)
          .filter(word => word.length > 3) // Only longer words
          .filter(word => !['drug', 'use', 'problems', 'research', 'study', 'studies'].includes(word)); // Remove common words
        
        flexibleTerms.push(...keywords);
      });
      
      // Remove duplicates and try searching
      const uniqueFlexibleTerms = [...new Set(flexibleTerms)].slice(0, 5);
      console.log("Flexible search terms:", uniqueFlexibleTerms);
      
      const flexibleResults = [];
      for (const term of uniqueFlexibleTerms) {
        if (term && term.length > 2) {
          try {
            console.log(`Flexible search for: "${term}"`);
            const termResults = await getFilteredProfiles({
              page: 0,
              pageSize: 20,
              queryByName,
              queryByResearchArea: term,
              units,
              types,
              isAcceptingGraduateStudents,
            });
            
            console.log(`"${term}" flexible search returned ${termResults.results?.length || 0} results`);
            if (termResults.results && termResults.results.length > 0) {
              flexibleResults.push(...termResults.results);
            }
          } catch (error) {
            console.log(`Flexible search failed for "${term}":`, error.message);
          }
        }
      }
      
      // Remove duplicates from flexible results
      const uniqueFlexibleProfiles = flexibleResults.filter((profile, index, arr) => 
        arr.findIndex(p => p.id === profile.id) === index
      ).slice(page * pageSize, (page + 1) * pageSize);
      
      if (uniqueFlexibleProfiles.length > 0) {
        facultyResults = {
          results: uniqueFlexibleProfiles,
          totalPages: Math.ceil(flexibleResults.length / pageSize),
          totalItems: flexibleResults.length
        };
        console.log(`Flexible search found ${flexibleResults.length} total results`);
      } else {
        // Strategy 3: Final fallback to combined search
        console.log("Strategy 3: Combined search as final fallback");
        const enhancedSearchTerms = [queryByResearchArea, ...uniqueTerms.slice(0, 3)].join(' ');
        console.log("Enhanced search terms for faculty lookup:", enhancedSearchTerms);
        
        facultyResults = await getFilteredProfiles({
          page,
          pageSize,
          queryByName,
          queryByResearchArea: enhancedSearchTerms,
          units,
          types,
          isAcceptingGraduateStudents,
        });
      }
    }

    try {
      // Add AI metadata to the results
      const strategy = profilesWithMatches.length > 0 ? "expanded_terms" : 
                      facultyResults.results?.length > 0 ? "flexible_search" : "combined_search";
                      
      const enhancedResults = {
        ...facultyResults,
        _aiEnhanced: true,
        _oramaTerms: researchTerms,
        _expandedTerms: searchTerms,
        _originalQuery: queryByResearchArea,
        _searchType: "ai_enhanced",
        _strategy: strategy
      };

      console.log("Enhanced faculty search results:", {
        strategy: strategy,
        originalResultCount: facultyResults.results?.length || 0,
        oramaTermsUsed: researchTerms.slice(0, 3),
        expandedTermsUsed: searchTerms.slice(0, 5)
      });

      return NextResponse.json(enhancedResults, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      });
      
    } catch (error) {
      console.error("Faculty search failed:", error);
      // Fallback: return the Orama findings as informational
      return NextResponse.json({
        results: [],
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
        pageSize: pageSize,
        error: "Faculty search failed",
        _oramaTermsFound: researchTerms
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
  } catch (error: any) {
    console.error("Vector search error:", error);
    
    // Provide more specific error handling
    if (error.message.includes("422") || error.message.includes("Failed to deserialize")) {
      console.error("Filter format error - the where clause format may be incorrect for this Orama version");
      return NextResponse.json({ 
        error: "Search filter format not supported. Please try with a simpler search or contact support.",
        details: "The Orama API filter format has changed. Filters are temporarily disabled."
      }, { status: 400 });
    }
    
    // Provide helpful error messages
    if (error.message.includes("credentials")) {
      return NextResponse.json({ 
        error: "Orama Cloud not properly configured. Please check your API credentials." 
      }, { status: 500 });
    }
    
    if (error.message.includes("project") || error.message.includes("404")) {
      return NextResponse.json({ 
        error: "Orama project not found. Please check your project ID configuration." 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: `Vector search failed: ${error.message}`,
      suggestion: "Try using regular search instead, or check your Orama configuration."
    }, { status: 500 });
  }
}