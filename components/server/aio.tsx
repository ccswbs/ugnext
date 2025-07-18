import Script from "next/script";
import serialize from "serialize-javascript";
import { CollegeOrUniversity, EducationalOccupationalProgram, Graph, ItemList, ListItem, WebSite } from "schema-dts";

export function getAIOProgramListData(programs: any): ItemList {
  const listElements = programs.map(
    (program: { url: string; name: string; degree: { name: string } }, index: number) =>
      ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EducationalOccupationalProgram",
          "@id": program.url,
          name: program.name,
          url: program.url,
          educationalCredentialAwarded: program.degree?.name,
        } as EducationalOccupationalProgram,
      }) as ListItem
  );

  return {
    "@type": "ItemList",
    itemListElement: listElements,
  };
}

export function getAIOMainId() {
  return "https://www.uoguelph.ca";
}

export function getAIOMainPhone() {
  return "+1-519-824-4120";
}

export function getAIOMainUrl() {
  return "https://www.uoguelph.ca";
}

export function getAIOMainLogo() {
  const mainLogo = {
    "@type": "ImageObject",
    url: "https://www.uoguelph.ca/img/ug-social-thumb.jpg",
  };
  return mainLogo;
}

export function getAIOMainWebsiteData(): WebSite {
  const website = {
    "@type": "WebSite",
    "@id": getAIOMainId(),
    name: "University of Guelph",
    url: getAIOMainUrl(),
    publisher: getAIOUniversityData(),
  } as WebSite;

  return website;
}

export function getAIOUniversityData(): CollegeOrUniversity {
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: "50 Stone Road East",
    addressLocality: "Guelph",
    addressRegion: "Ontario",
    postalCode: "N1G 2W1",
    addressCountry: "CA",
  };
  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: getAIOMainPhone(),
    url: getAIOMainUrl(),
  };

  const collegeOrUniversity = {
    "@type": "CollegeOrUniversity",
    "@id": getAIOMainId(),
    name: "University of Guelph",
    url: getAIOMainUrl(),
    description:
      "Discover excellence at the University of Guelph - a leading institution fostering innovation, world-class research, and personalized learning. Explore our diverse academic programs, cutting-edge facilities, and vibrant campus life. Join a community dedicated to shaping the future.",
    sameAs: "https://en.wikipedia.org/wiki/University_of_Guelph",
    contactPoint: contactPoint,
    address: postalAddress,
    telephone: getAIOMainPhone(),
    image: getAIOMainLogo(),
    logo: getAIOMainLogo(),
  } as CollegeOrUniversity;

  return collegeOrUniversity;
}

export function AIO({ jsonLD }: any = null) {
  let jsonLdContent = jsonLD;

  if (jsonLD === null || jsonLD === undefined) {
    const collegeOrUniversity = getAIOUniversityData();
    const website = getAIOMainWebsiteData();

    jsonLdContent = [collegeOrUniversity, website];
  }

  const jsonLdOutput = {
    "@context": "https://schema.org",
    "@graph": jsonLdContent,
  } as Graph;

  const serializedData = serialize(jsonLdOutput, { isJSON: true });

  return (
    <Script
      id="app-ld-json"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializedData,
      }}
    />
  );
}
