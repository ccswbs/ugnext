"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { buildContactInfoArray, renderContactInfo } from "@/lib/contact-info-utils";

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
  const contactInfo = buildContactInfoArray(
    contactData, 
    { directoryEmail, directoryOffice, directoryPhone }
  );

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

  return renderContactInfo(contactInfo, directoryEmail, className);
}