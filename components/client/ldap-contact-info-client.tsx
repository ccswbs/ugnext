"use client";

import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { useLdapProfile } from "@/lib/use-ldap-profile";

interface LdapContactInfoClientProps {
  centralLoginId: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  className?: string;
}

export function LdapContactInfoClient({ 
  centralLoginId, 
  directoryEmail, 
  directoryOffice, 
  directoryPhone, 
  className = "mb-4" 
}: LdapContactInfoClientProps) {
  // Determine if we should fetch LDAP data
  const shouldFetchLdap = !!(centralLoginId && (directoryEmail || directoryOffice || directoryPhone));

  // Use the hook to fetch LDAP data
  const { data: ldapData, loading, error } = useLdapProfile(centralLoginId, shouldFetchLdap);

  // Build contact info array
  const contactInfo = [];
  
  if (directoryEmail && ldapData?.mail) {
    contactInfo.push(
      <React.Fragment key="email">
        <i className="fa-solid fa-envelope me-2" aria-hidden="true"></i>
        <span className="sr-only">Email:</span>{ldapData.mail}
      </React.Fragment>
    );
  }
  
  if (directoryOffice && ldapData?.roomNumber && typeof ldapData.roomNumber === 'string' && ldapData.roomNumber.trim()) {
    contactInfo.push(
      <React.Fragment key="office">
        <i className="fa-solid fa-building-columns me-2" aria-hidden="true"></i>
        <span className="sr-only">Office:</span>{ldapData.roomNumber}
      </React.Fragment>
    );
  }
  
  if (directoryPhone && ldapData?.telephoneNumber && typeof ldapData.telephoneNumber === 'string' && ldapData.telephoneNumber.trim()) {
    contactInfo.push(
      <React.Fragment key="phone">
        <i className="fa-solid fa-phone me-2" aria-hidden="true"></i>
        <span className="sr-only">Phone:</span>{ldapData.telephoneNumber}
        {ldapData.telephoneNumber2 && typeof ldapData.telephoneNumber2 === 'string' && ldapData.telephoneNumber2.trim() && (
          <>
            <br />
            <span className="ms-6">{ldapData.telephoneNumber2}</span>
          </>
        )}
      </React.Fragment>
    );
  }

  // Handle loading state
  if (shouldFetchLdap && loading) {
    return (
      <Typography type="body" className={`${className} text-center text-gray-500`}>
        Loading contact info...
      </Typography>
    );
  }

  // Handle error state
  if (shouldFetchLdap && error) {
    return (
      <Typography type="body" className={`${className} text-center text-red-500`}>
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
