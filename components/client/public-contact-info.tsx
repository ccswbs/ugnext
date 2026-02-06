"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { ContactEmail, ContactPhone } from "@uoguelph/react-components/contact";
import { parsePhoneNumber } from "@/lib/string-utils";

interface PublicContactInfoProps {
  email?: string;
  directoryEmail: boolean;
  directoryOffice: boolean;
  directoryPhone: boolean;
  className?: string;
}

interface ContactData {
  mail: string | null;
  businessPhones: string[] | null;
  mobilePhone: string | null;
  officeLocation: string | null;
}

export function PublicContactInfo({ 
  email, 
  directoryEmail, 
  directoryOffice, 
  directoryPhone, 
  className 
}: PublicContactInfoProps) {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !(directoryEmail || directoryOffice || directoryPhone)) {
      setContactData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`/api/public-contact?email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch contact info`);
        }
        
        const data = await response.json();
        setContactData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setContactData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [email, directoryEmail, directoryOffice, directoryPhone]);

  // Build contact info array
  const contactInfo = [];
  
  if (directoryEmail && contactData?.mail) {
    contactInfo.push(
      <ContactEmail key="email" email={contactData.mail} />
    );
  }
  
  if (directoryOffice && contactData?.officeLocation && typeof contactData.officeLocation === 'string' && contactData.officeLocation.trim()) {
    contactInfo.push(
      <React.Fragment key="office">
        <i className="fa-solid fa-building-columns me-2" aria-hidden="true"></i>
        <span className="sr-only">Office:</span>{contactData.officeLocation}
      </React.Fragment>
    );
  }
  
  if (directoryPhone) {
    // Handle business phones (array)
    if (contactData?.businessPhones && Array.isArray(contactData.businessPhones) && contactData.businessPhones.length > 0) {
      contactData.businessPhones.forEach((phone, index) => {
        const { number, extension } = parsePhoneNumber(phone);
        contactInfo.push(
          <ContactPhone key={`phone-business-${index}`} number={number} extension={extension} />
        );
      });
    }
    
    // Handle mobile phone if no business phones or as additional number
    if (contactData?.mobilePhone && typeof contactData.mobilePhone === 'string' && contactData.mobilePhone.trim()) {
      const { number, extension } = parsePhoneNumber(contactData.mobilePhone);
      contactInfo.push(
        <ContactPhone key="phone-mobile" number={number} extension={extension} />
      );
    }
  }

  // Handle loading state
  if (loading) {
    return (
      <Typography type="body" className={className ? `${className} text-center text-gray-500` : "text-center text-gray-500"}>
        Loading contact info...
      </Typography>
    );
  }

  // Handle error state
  if (error) {
    return null; // Silently fail for better UX
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