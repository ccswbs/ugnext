import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { fetchAadProfile } from "@/lib/aad-utils";
import { obfuscateEmail } from "@/lib/string-utils";

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
  const contactInfo = [];
  
  if (directoryEmail === true && aadData?.mail) {
    const { display, href } = obfuscateEmail(aadData.mail);
    contactInfo.push(
      <React.Fragment key="email">
        <i className="fa-solid fa-envelope me-2" aria-hidden="true"></i>
        <span className="sr-only">Email:</span>
        <a 
          href={href}
          dangerouslySetInnerHTML={{ __html: display }}
          className="text-body-copy-link underline hover:decoration-transparent"
          aria-label={`Send email to ${aadData.mail}`}
        />
      </React.Fragment>
    );
  }
  
  if (directoryOffice === true && aadData?.officeLocation && typeof aadData.officeLocation === 'string' && aadData.officeLocation.trim()) {
    contactInfo.push(
      <React.Fragment key="office">
        <i className="fa-solid fa-building-columns me-2" aria-hidden="true"></i>
        <span className="sr-only">Office:</span>{aadData.officeLocation}
      </React.Fragment>
    );
  }
  
  if (directoryPhone === true) {
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
  } catch (error) {
    console.error('Error in AadContactInfo component:', error);
    return null;
  }
}