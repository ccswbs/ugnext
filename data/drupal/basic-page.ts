import { gql } from "@/lib/graphql";
import { showUnpublishedContent } from "@/lib/show-unpublished-content";
import { handleGraphQLError, query } from "@/lib/apollo";
import { getTestimonialByTag } from "@/data/drupal/testimonial";
import { getProfiles, getProfilesByType, getProfilesByUnit, getProfileTypes, getProfilesByTypeName } from "@/data/drupal/profile";

export const BASIC_PAGE_FRAGMENT = gql(/* gql */ `
  fragment BasicPage on NodePage {
    status
    id
    title
    path
    primaryNavigation {
      ...Navigation
    }
    image {
      ...Image
    }
    heroWidgets {
      ...ModalVideo
    }
    widgets {
      __typename
      ...Accordion
      ...Block
      ...GeneralText
      ...Links
      ...MediaText
      ...Tabs
      ...Statistics
      ...TestimonialSlider
      ...Story
      ...ImageOverlay
      ...Section
      ...ProfileBlock
      ...ProfileCard
    }
    tags {
      ...Tag
      ...Unit
    }
  }
`);

export async function getPageContent(id: string) {
  const showUnpublished = await showUnpublishedContent();

  const { data, error } = await query({
    query: gql(/* gql */ `
      query BasicPageContent($id: ID!, $revision: ID = "current") {
        nodePage(id: $id, revision: $revision) {
          ...BasicPage
        }
      }
    `),
    variables: {
      id: id,
      revision: showUnpublished ? "latest" : "current",
    },
  });

  if (error) {
    handleGraphQLError(error);
  }

  if (!data?.nodePage) {
    return null;
  }

  if (data.nodePage.status === false && !showUnpublished) {
    return null;
  }

  if (!data.nodePage.widgets) {
    return data.nodePage;
  }

  // We need to resolve testimonials by tag and profiles for profile blocks.
  // This function recursively processes widgets, including nested ones in sections
  async function processWidget(widget: any): Promise<any> {
    console.log('processWidget called with:', widget.__typename);
    if (widget.__typename === "ParagraphTestimonialSlider") {
      const tags =
        widget.byTags
          ?.map((tag: any) => {
            if (tag.__typename === "TermTag") {
              return tag.id;
            }
            return null;
          })
          .filter((tag: any) => typeof tag === "string") ?? [];

      if(tags.length === 0) {
        return widget;
      }

      return {
        ...widget,
        byTags: (await getTestimonialByTag(tags)) ?? [],
      };
    }

    if (widget.__typename === "ParagraphProfileCard") {
      // ProfileCard should already have the profileInfo populated by the GraphQL query
      // No additional fetching needed since the profile data comes directly from the CMS
      return widget;
    }

    if (widget.__typename === "ParagraphProfileBlock") {
      console.log('=== ProfileBlock processing started ===');
      console.log('ProfileBlock widget configuration:', {
        profileType: widget.profileType,
        unit: widget.unit,
        researchArea: widget.researchArea
      });
      
      // Fetch profiles based on the criteria specified in the widget
      let profiles = [];

      try {
        // Define mapping from backend profile types to frontend categories
        // Note: This mapping may need updates if new profile types are added to the backend
        const profileTypeMapping = {
          "Faculty": [
            "Academic Advisors", "Adjunct Faculty", "Associated Graduate Faculty", 
            "Faculty", "Faculty (all)", "Faculty (Mathematics)", "Faculty (Statistics)", 
            "Faculty/Sessional", "Faculty: Adjunct", "Faculty: Emeritus (University or College)",
            "Faculty: Full, Assistant, & Associate Professors", "Faculty: Retired",
            "Professor Emerita", "Professor Emeritus", "Professor Emeritus/Emerita", 
            "Professors Emeriti/Retired Faculty", "Retired Faculty", "Sessional", "Sessional Lecturer",
            "Teaching", "University Professor Emerita", "University Professor Emeritus",
            // Additional common faculty types that might be missing
            "Professor", "Associate Professor", "Assistant Professor", "Lecturer", 
            "Clinical Faculty", "Visiting Faculty", "Research Faculty"
          ],
          "Staff": [
            "Admin Staff", "Administration", "Affiliated Professional", "Department Staff", "Office Staff",
            "Research and Technical Staff", "Research Scientist", "Research Staff", "Researcher", 
            "Staff", "Support Staff", "Undergraduate Student Researchers",
            // Additional staff types
            "Administrative Staff", "Technical Staff", "Laboratory Staff", "Research Associate"
          ],
          "Graduate Students": [
            "Grad Student", "Graduate Student", "Graduate Students",
            // Additional graduate student types
            "PhD Student", "Masters Student", "PhD Candidate", "Graduate Research Assistant"
          ],
          "Postdoctoral Scholars": [
            "Post Doc", "Postdocs", "Postdoctoral Fellow",
            // Additional postdoc types
            "Postdoc", "Postdoctoral Researcher", "Postdoctoral Associate"
          ]
        };
        
        console.log('ProfileBlock processing - checking conditions:', {
          hasUnit: !!widget.unit,
          unitLength: widget.unit?.length || 0,
          unitConditionMet: widget.unit && widget.unit.length > 0
        });
        
        // Check if unit filtering is specified
        if (widget.unit && widget.unit.length > 0) {
          console.log('ProfileBlock: Unit filtering condition met, processing units...');
          // If units are specified, fetch profiles from all specified units
          const unitIds = widget.unit.map((unit: any) => unit.id).filter(Boolean);
          console.log('ProfileBlock fetching profiles for unit IDs:', unitIds);
          
          if (unitIds.length === 0) {
            console.warn('ProfileBlock: No valid unit IDs found, falling back to all profiles');
            profiles = [];
          } else {
            const unitProfilePromises = unitIds.map((unitId: string) => 
              getProfilesByUnit(unitId).then(result => {
                console.log(`getProfilesByUnit(${unitId}) returned:`, result?.length || 0, 'profiles');
                return result || [];
              })
            );
            const unitProfileResults = await Promise.all(unitProfilePromises);
            let allUnitProfiles = unitProfileResults.flat();
            console.log('Total profiles from all units:', allUnitProfiles.length);
            

            
            // If profile types are also specified, filter by types
            if (widget.profileType && widget.profileType.length > 0) {
              const requestedTypes = widget.profileType.map((type: any) => type.name);
              const allowedFrontendTypes = Object.keys(profileTypeMapping);
              const typesToProcess = requestedTypes.filter((type: string) => allowedFrontendTypes.includes(type));
              
              // Get all backend types that map to the requested frontend types
              const backendTypesToFetch = typesToProcess.flatMap((frontendType: string) => 
                profileTypeMapping[frontendType as keyof typeof profileTypeMapping]
              );
              
              // Filter unit profiles by the specified types
              profiles = allUnitProfiles.filter((profile: any) => {
                const backendTypeName = Array.isArray(profile.profileType) 
                  ? profile.profileType[0]?.name 
                  : profile.profileType?.name;
                const matches = backendTypesToFetch.includes(backendTypeName);
                
                // Debug logging for type matching
                if (!matches && process.env.NODE_ENV === 'development') {
                  console.log(`ProfileBlock - Profile type "${backendTypeName}" not found in mapping for:`, profile.title);
                }
                
                return matches;
              }).map((profile: any) => {
                // Map backend types to frontend types
                const backendTypeName = Array.isArray(profile.profileType) 
                  ? profile.profileType[0]?.name 
                  : profile.profileType?.name;
                
                for (const [frontendType, backendTypes] of Object.entries(profileTypeMapping)) {
                  if (backendTypes.includes(backendTypeName)) {
                    return {
                      ...profile,
                      profileType: {
                        ...profile.profileType,
                        name: frontendType
                      }
                    };
                  }
                }
                return profile;
              });
            } else {
              // No type filtering, use all profiles from the units but map types
              profiles = allUnitProfiles.map((profile: any) => {
                const backendTypeName = Array.isArray(profile.profileType) 
                  ? profile.profileType[0]?.name 
                  : profile.profileType?.name;
                
                for (const [frontendType, backendTypes] of Object.entries(profileTypeMapping)) {
                  if (backendTypes.includes(backendTypeName)) {
                    return {
                      ...profile,
                      profileType: {
                        ...profile.profileType,
                        name: frontendType
                      }
                    };
                  }
                }
                return profile;
              });
            }
          }
        } else if (widget.profileType && widget.profileType.length > 0) {
          console.log('ProfileBlock: No units specified, but profile types found, processing types...');
          // No unit specified, but profile types are specified
          const requestedTypes = widget.profileType.map((type: any) => type.name);
          const allowedFrontendTypes = Object.keys(profileTypeMapping);
          const typesToProcess = requestedTypes.filter((type: string) => allowedFrontendTypes.includes(type));
          
          // Get all backend types that map to the requested frontend types
          const backendTypesToFetch = typesToProcess.flatMap((frontendType: string) => 
            profileTypeMapping[frontendType as keyof typeof profileTypeMapping]
          );
          
          // Fetch profiles for each backend type and merge results
          console.log('ProfileBlock: Fetching profiles for backend types:', backendTypesToFetch);
          const profilePromises = backendTypesToFetch.map((type: string) => getProfilesByTypeName(type));
          const profileResults = await Promise.all(profilePromises);
          
          // Flatten the results and map backend types to frontend types
          const allProfiles = profileResults.flat();
          console.log(`ProfileBlock: Fetched ${allProfiles.length} profiles by type from ${backendTypesToFetch.length} backend types:`, backendTypesToFetch);
          
          profiles = allProfiles.map((profile: any) => {
            // Find which frontend type this backend type maps to
            const backendTypeName = Array.isArray(profile.profileType) 
              ? profile.profileType[0]?.name 
              : profile.profileType?.name;
            
            for (const [frontendType, backendTypes] of Object.entries(profileTypeMapping)) {
              if (backendTypes.includes(backendTypeName)) {
                return {
                  ...profile,
                  profileType: {
                    ...profile.profileType,
                    name: frontendType
                  }
                };
              }
            }
            return profile;
          });
        } else {
          console.log('ProfileBlock: No units or types specified, fetching all profiles...');
          // No specific criteria, fetch all profiles from allowed backend types
          const allBackendTypes = Object.values(profileTypeMapping).flat();
          console.log('ProfileBlock: Fetching profiles for all backend types:', allBackendTypes.length, 'types');
          const profilePromises = allBackendTypes.map((type: string) => getProfilesByTypeName(type));
          const profileResults = await Promise.all(profilePromises);
          
          // Flatten the results and map backend types to frontend types
          const allProfiles = profileResults.flat();
          profiles = allProfiles.map((profile: any) => {
            // Find which frontend type this backend type maps to
            const backendTypeName = Array.isArray(profile.profileType) 
              ? profile.profileType[0]?.name 
              : profile.profileType?.name;
            
            for (const [frontendType, backendTypes] of Object.entries(profileTypeMapping)) {
              if (backendTypes.includes(backendTypeName)) {
                return {
                  ...profile,
                  profileType: {
                    ...profile.profileType,
                    name: frontendType
                  }
                };
              }
            }
            return profile;
          });
        }

        console.log('ProfileBlock fetched profiles count:', profiles.length);
        
        // Debug: Log profile types that were actually found
        if (process.env.NODE_ENV === 'development') {
          if (profiles.length > 0) {
            const foundTypes = [...new Set(profiles.map((p: any) => 
              Array.isArray(p.profileType) ? p.profileType[0]?.name : p.profileType?.name
            ))];
            console.log('ProfileBlock found profile types:', foundTypes);
          } else {
            // No profiles found - fetch all available profile types for debugging
            console.warn('ProfileBlock: No profiles found. Checking available profile types...');
            try {
              const availableTypes = await getProfileTypes();
              const availableTypeNames = availableTypes.map((t: any) => t.name);
              console.log('Available profile types in system:', availableTypeNames);
              
              const mappedTypes = Object.values(profileTypeMapping).flat();
              const unmappedTypes = availableTypeNames.filter((type: string) => !mappedTypes.includes(type));
              if (unmappedTypes.length > 0) {
                console.warn('Profile types not in mapping (may need to be added):', unmappedTypes);
              }
            } catch (error) {
              console.error('Error fetching available profile types:', error);
            }
          }
        }
        
        return {
          ...widget,
          profiles: profiles ?? [],
        };
      } catch (error) {
        console.error('Error fetching profiles for ProfileBlock:', error);
        return {
          ...widget,
          profiles: [],
        };
      }
    }

    // Handle section widgets by recursively processing their content
    if (widget.__typename === "ParagraphSection" && widget.content) {
      return {
        ...widget,
        content: await Promise.all(
          widget.content.map((nestedWidget: any) => processWidget(nestedWidget))
        ),
      };
    }

    return widget;
  }

  return {
    ...data.nodePage,
    widgets: await Promise.all(
      data.nodePage.widgets.map((widget) => processWidget(widget))
    ),
  };
}
