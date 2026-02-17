import React from "react";
import { Typography } from "@uoguelph/react-components/typography";
import { ContactEmail, ContactPhone } from "@uoguelph/react-components/contact";
import { parsePhoneNumber } from "@/lib/string-utils";

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
        <span className="sr-only">Office:</span>{data.officeLocation}
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