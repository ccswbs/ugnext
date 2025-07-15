import Script from "next/script";
import serialize from "serialize-javascript"; 
import { CollegeOrUniversity, Graph, WebSite } from 'schema-dts'

export function AIO (jsonLD = null) {
  const context = "https://schema.org";
  const id = "https://www.uoguelph.ca";
  const url = "https://www.uoguelph.ca/"
  const phone = "+1-519-824-4120";
    
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: "50 Stone Road East",
    addressLocality: "Guelph",
    addressRegion: "Ontario",
    postalCode: "N1G 2W1",
    addressCountry: "Canada",
  };
  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: phone,
    url: url,
  }

  const collegeOrUniversity = {
    '@context': context,
    "@type": "CollegeOrUniversity",
    "@id": id,
    name: "University of Guelph",
    url: url,
    description: "Discover excellence at the University of Guelph - a leading institution fostering innovation, world-class research, and personalized learning. Explore our diverse academic programs, cutting-edge facilities, and vibrant campus life. Join a community dedicated to shaping the future.",
    sameAs: "https://en.wikipedia.org/wiki/University_of_Guelph",
    contactPoint: contactPoint,
    address: postalAddress,
    telephone: phone,
    logo: {
        "@type": "ImageObject",
        url: "https://www.uoguelph.ca/img/ug-social-thumb.jpg"
    },
  } as CollegeOrUniversity;

  const website = {
    "@type": "WebSite",
    "@id": id,
    name: "University of Guelph",
    url: url,
    publisher: collegeOrUniversity,
  } as WebSite;

  const jsonLdContent = jsonLD || {
      collegeOrUniversity,
      website,
  };

  const jsonLdOutput = {
    "@context": context,
    "@graph": jsonLdContent,
  } as Graph;

  const serializedData = serialize(jsonLdOutput, { isJSON: true });

  return (
    <Script
      id="app-ld-json"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: (serializedData),
      }}
    />
  );
}