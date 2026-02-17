import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { ContactEmail, ContactPhone } from "@uoguelph/react-components/contact";
import { Link } from "@uoguelph/react-components/link";
import { parsePhoneNumber } from "@/lib/string-utils";
import locationsData from "@/data/json/locations.json";

interface ContactData {
  mail?: string | null;
  officeLocation?: string | null;
  businessPhones?: string[] | null;
  mobilePhone?: string | null;
}

interface ContactInfoOptions {
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
}

interface LocationData {
  acronym: string;
  name: string;
  link: string;
}

/**
 * Extracts potential building acronyms from an office location string.
 * Looks for uppercase letter sequences that could be building codes.
 */
export function extractBuildingAcronyms(officeLocation: string): string[] {
  // Match sequences of 2-6 uppercase letters (common building acronym pattern)
  const acronymPattern = /\b[A-Z]{2,6}\b/g;
  const matches = officeLocation.match(acronymPattern) || [];
  return [...new Set(matches)]; // Remove duplicates
}

/**
 * Looks up building information by acronym in the locations data.
 */
export function findBuildingByAcronym(acronym: string): LocationData | null {
  const building = locationsData.find(
    (location) => location.acronym && location.acronym.toUpperCase() === acronym.toUpperCase()
  );
  return building ?? null;
}

/**
 * Renders office location with linked building acronyms where applicable.
 */
export function renderOfficeLocationWithLinks(officeLocation: string): React.ReactNode {
  // Safety check for empty or invalid office location
  if (!officeLocation || typeof officeLocation !== 'string' || !officeLocation.trim()) {
    return officeLocation || '';
  }

  const acronyms = extractBuildingAcronyms(officeLocation);
  
  if (acronyms.length === 0) {
    return officeLocation;
  }

  let result: React.ReactNode = officeLocation;

  // Replace each found acronym with a link if it exists in locations data
  acronyms.forEach((acronym, index) => {
    const building = findBuildingByAcronym(acronym);
    
    if (building) {
      const mapUrl = `https://www.uoguelph.ca${building.link}`;
      
      // Create a regex to find the acronym in the current result
      const acronymRegex = new RegExp(`\\b${acronym}\\b`, 'g');
      
      // For the first acronym, we work with the original string
      if (index === 0) {
        const parts = officeLocation.split(acronymRegex);
        const matches = officeLocation.match(acronymRegex) || [];
        
        result = (
          <>
            {parts.map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                {part}
                {partIndex < matches.length && (
                  <Link href={mapUrl}>
                    {building.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </>
        );
      } else {
        // For subsequent acronyms, we need to handle the existing React node structure
        // This is more complex and would require recursive processing
        // For now, we'll prioritize the first found acronym
        // TODO: Handle multiple acronyms in a single office location string
      }
    }
  });

  return result;
}

export function buildContactInfoArray(
  data: ContactData | null,
  options: ContactInfoOptions
): React.ReactNode[] {
  const { directoryEmail, directoryOffice, directoryPhone } = options;
  const contactInfo: React.ReactNode[] = [];

  // Email
  if (directoryEmail && data?.mail) {
    contactInfo.push(
      <ContactEmail key="email" email={data.mail} />
    );
  }

  // Office
  if (directoryOffice && data?.officeLocation && typeof data.officeLocation === 'string' && data.officeLocation.trim()) {
    contactInfo.push(
      <React.Fragment key="office">
        <i className="fa-solid fa-building-columns me-2" aria-hidden="true"></i>
        <span className="sr-only">Office:</span>
        {renderOfficeLocationWithLinks(data.officeLocation)}
      </React.Fragment>
    );
  }

  // Phone numbers  
  if (directoryPhone) {
    // Handle business phones (array)
    if (data?.businessPhones && Array.isArray(data.businessPhones) && data.businessPhones.length > 0) {
      data.businessPhones.forEach((phone, index) => {
        const { number, extension } = parsePhoneNumber(phone);
        contactInfo.push(
          <ContactPhone key={`phone-business-${index}`} number={number} extension={extension} />
        );
      });
    }

    // Handle mobile phone if no business phones or as additional number
    if (data?.mobilePhone && typeof data.mobilePhone === 'string' && data.mobilePhone.trim()) {
      const { number, extension } = parsePhoneNumber(data.mobilePhone);
      contactInfo.push(
        <ContactPhone key="phone-mobile" number={number} extension={extension} />
      );
    }
  }

  return contactInfo;
}

export function renderContactInfo(
  contactInfo: React.ReactNode[],
  directoryEmail: boolean,
  className?: string
): React.ReactNode | null {
  // Return null if no contact info to display
  if (contactInfo.length === 0) {
    return null;
  }

  return (
    <Typography type="body" className={className}>
      {contactInfo.map((info, index) => (
        <React.Fragment key={index}>
          {index > 0 && !(index === 1 && directoryEmail) && <br />}
          {info}
        </React.Fragment>
      ))}
    </Typography>
  );
}