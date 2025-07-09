import Script from "next/script";

export function AIO () {
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
  };

  const website = {
    "@type": "WebSite",
    "@id": id,
    name: "University of Guelph",
    url: url,
    publisher: collegeOrUniversity,
  }

  const jsonLd = {
    "@context": context,
    "@graph": {
      collegeOrUniversity,
      website,
    } 
  }

  return (
      <Script
        id="app-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
  );
}