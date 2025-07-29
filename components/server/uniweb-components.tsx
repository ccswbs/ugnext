import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { HtmlParser } from "@/components/client/html-parser";
import { getProfile } from "@/lib/uniweb-utils";

// Helper function to format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('/');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Helper function to parse JSON strings
const parseJsonField = (field: string) => {
  try {
    const parsed = JSON.parse(field);
    return parsed.en || field;
  } catch {
    return field;
  }
};

// Helper function to format year
const formatYear = (yearStr: string) => {
  if (!yearStr) return '';
  const [year] = yearStr.split('/');
  return year;
};

// Component to display Uniweb affiliations
export async function UniwebAffiliations({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.affiliations && uniwebProfile.affiliations.length > 0) {
      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Affiliations
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniwebProfile.affiliations.map((affiliation) => (
              <div key={affiliation.id} className="border border-gray-200 p-4 rounded">
                <Typography type="body" className="font-semibold">
                  {parseJsonField(affiliation.position_title)}, {parseJsonField(affiliation.organization)} ({formatDate(affiliation.start_date)}{affiliation.end_date ? ` - ${formatDate(affiliation.end_date)}` : ' - present'})
                </Typography>
              </div>
            ))}
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb affiliations:', error);
  }
  
  return null;
}

// Component to display Uniweb current teaching
export async function UniwebCurrentTeaching({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.current_teaching && uniwebProfile.current_teaching.length > 0) {
      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Current Teaching
          </Typography>
          <ul className="space-y-2">
            {uniwebProfile.current_teaching.map((course) => (
              <li key={course.course_name} className="border-l-4 border-blue-200 pl-4">
                <Typography type="body" className="font-semibold">
                  {course.course_name}
                </Typography>
                <Typography type="body" className="text-gray-600 text-sm">
                  Role: {course.role}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb current teaching:', error);
  }
  
  return null;
}

// Component to display Uniweb degrees
export async function UniwebDegrees({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.selected_degrees && uniwebProfile.selected_degrees.length > 0) {
      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Degrees
          </Typography>
          <ul className="space-y-2">
            {uniwebProfile.selected_degrees.map((degree) => (
              <li key={degree.year + degree.degree_name}>
                <Typography type="body">
                  {parseJsonField(degree.degree_name)} in {parseJsonField(degree.specialty)}, {parseJsonField(degree.institution)} ({formatYear(degree.year)})
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb degrees:', error);
  }
  
  return null;
}

// Component to display Uniweb publications
export async function UniwebPublications({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.selected_publications && 
        (uniwebProfile.selected_publications.journal_articles?.length > 0 || 
         uniwebProfile.selected_publications.pubmed_articles?.length > 0)) {
      
      const allPublications = [
        ...(uniwebProfile.selected_publications.journal_articles || []),
        ...(uniwebProfile.selected_publications.pubmed_articles || [])
      ];

      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Selected Publications
          </Typography>
          <ul className="space-y-3">
            {allPublications.map((publication, index) => (
              <li key={publication.id || index} className="border-l-4 border-green-200 pl-4">
                <Typography type="body" className="font-semibold mb-1">
                  {publication.article_title}
                </Typography>
                <Typography type="body" className="text-gray-600 text-sm mb-1">
                  {publication.authors}
                </Typography>
                <Typography type="body" className="text-gray-500 text-sm">
                  {publication.journal} ({formatYear(publication.date)})
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb publications:', error);
  }
  
  return null;
}

// Component to display Uniweb research description
export async function UniwebResearchDesc({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.research_description && uniwebProfile.research_description.length > 0) {
      const researchDesc = parseJsonField(uniwebProfile.research_description[0].research_description);

      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Research Description
          </Typography>
          <HtmlParser html={researchDesc} instructions={undefined} />
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb research description:', error);
  }
  
  return null;
}

// Component to display Uniweb research interests
export async function UniwebResearchInterests({ uniwebId }: { uniwebId: string }) {
  try {
    const uniwebProfile = await getProfile(uniwebId);
    
    if (uniwebProfile.research_interests && uniwebProfile.research_interests.length > 0) {
      const sortedInterests = uniwebProfile.research_interests
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));
      
      return (
        <div className="mb-4">
          <Typography type="h3" as="h3" className="mb-2">
            Research Interests
          </Typography>
          <ul className="list-disc list-inside space-y-1 ml-4">
            {sortedInterests.map((interest) => (
              <li key={interest.id}>
                <Typography type="body" className="inline">
                  {interest.interest[1]}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching Uniweb research interests:', error);
  }
  
  return null;
}
