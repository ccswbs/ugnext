"use client";

import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { useAadProfile } from "@/lib/use-aad-profile";

interface AadContactInfoClientProps {
  email?: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  className?: string;
}

export function AadContactInfoClient({ 
  email, 
  directoryEmail, 
  directoryOffice, 
  directoryPhone, 
  className 
}: AadContactInfoClientProps) {
  // Determine if we should fetch AAD data
  const shouldFetchAad = !!(email && (directoryEmail || directoryOffice || directoryPhone));

  // Use the hook to fetch AAD data
  const { data: aadData, loading, error } = useAadProfile(email ?? null, shouldFetchAad);

  // Build contact info array
  const contactInfo = [];
  
  if (directoryEmail && aadData?.mail) {
    contactInfo.push(
      <React.Fragment key="email">
        <i className="fa-solid fa-envelope me-2" aria-hidden="true"></i>
        <span className="sr-only">Email:</span>
        <a href={`mailto:${aadData.mail}`} className="text-body-copy-link underline hover:decoration-transparent">
          {aadData.mail}
        </a>
      </React.Fragment>
    );
  }
  
  if (directoryOffice && aadData?.officeLocation && typeof aadData.officeLocation === 'string' && aadData.officeLocation.trim()) {
    contactInfo.push(
      <React.Fragment key="office">
        <i className="fa-solid fa-building-columns me-2" aria-hidden="true"></i>
        <span className="sr-only">Office:</span>{aadData.officeLocation}
      </React.Fragment>
    );
  }
  
  if (directoryPhone) {
    // Handle business phones (array)
    if (aadData?.businessPhones && Array.isArray(aadData.businessPhones) && aadData.businessPhones.length > 0) {
      contactInfo.push(
        <React.Fragment key="phone-business">
          <i className="fa-solid fa-phone me-2" aria-hidden="true"></i>
          <span className="sr-only">Phone:</span>{aadData.businessPhones[0]}
          {aadData.businessPhones.slice(1).map((phone, index) => (
            <React.Fragment key={`business-${index}`}>
              <br />
              <span className="ms-6">{phone}</span>
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    }
    
    // Handle mobile phone if no business phones or as additional number
    if (aadData?.mobilePhone && typeof aadData.mobilePhone === 'string' && aadData.mobilePhone.trim()) {
      const isAdditional = aadData?.businessPhones && aadData.businessPhones.length > 0;
      contactInfo.push(
        <React.Fragment key="phone-mobile">
          {!isAdditional && (
            <>
              <i className="fa-solid fa-mobile me-2" aria-hidden="true"></i>
              <span className="sr-only">Mobile:</span>
            </>
          )}
          {isAdditional && (
            <>
              <br />
              <i className="fa-solid fa-mobile ms-0 me-2" aria-hidden="true"></i>
              <span className="sr-only">Mobile:</span>
            </>
          )}
          {aadData.mobilePhone}
        </React.Fragment>
      );
    }
  }

  // Handle loading state
  if (shouldFetchAad && loading) {
    return (
      <Typography type="body" className={className ? `${className} text-center text-gray-500` : "text-center text-gray-500"}>
        Loading contact info...
      </Typography>
    );
  }

  // Handle error state
  if (shouldFetchAad && error) {
    return (
      <Typography type="body" className={className ? `${className} text-center text-red-500` : "text-center text-red-500"}>
        Contact info unavailable: {error}
      </Typography>
    );
  }

  // Return null if no contact info to display
  if (contactInfo.length === 0) {
    return null;
  }

  return (
    <Typography type="body" className={className}>
      {contactInfo.map((info, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {info}
        </React.Fragment>
      ))}
    </Typography>
  );
}