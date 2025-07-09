import Head from "next/head";
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

export function Meta({
  title = "University of Guelph - Improve Life",
  description = "Discover excellence at the University of Guelph - a leading institution fostering innovation, world-class research, and personalized learning. Explore our diverse academic programs, cutting-edge facilities, and vibrant campus life. Join a community dedicated to shaping the future.",
  image = {
    src: "https://www.uoguelph.ca/img/ug-social-thumb.jpg",
    alt: "University of Guelph logo",
  },
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image.src} />
      <meta property="og:image:alt" content={image.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@uofg" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={image.src} />
      <meta name="twitter:image:alt" content={image.alt} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
