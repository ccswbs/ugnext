import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { fetchAadProfile } from "@/lib/aad-utils";
import { buildContactInfoArray, renderContactInfo } from "@/lib/contact-info-utils";

interface AadContactInfoProps {
  email?: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  className?: string;
}

export async function AadContactInfo({ 
  email, 
  directoryEmail, 
  directoryOffice, 
  directoryPhone, 
  className = "mb-4" 
}: AadContactInfoProps) {
  try {
    // Early return if no email provided
    if (!email || !email.trim()) {
      return null;
    }

    // Fetch AAD data if any directory fields are enabled and we have an email
    const shouldFetchAad = email && (directoryEmail === true || directoryOffice === true || directoryPhone === true);
    
    let aadData = null;
    if (shouldFetchAad) {
      try {
        aadData = await fetchAadProfile(email);
      } catch (error) {
        console.error('Error fetching AAD profile:', error);
        // Return null instead of throwing to prevent the entire page from crashing
        return null;
      }
    }

  // Build contact info array to avoid complex conditional markup
  const contactInfo = buildContactInfoArray(
    aadData,
    {
      directoryEmail: !!directoryEmail,
      directoryOffice: !!directoryOffice,
      directoryPhone: !!directoryPhone
    }
  );

  return renderContactInfo(contactInfo, !!directoryEmail, className);
  } catch (error) {
    console.error('Error in AadContactInfo component:', error);
    return null;
  }
}