import Head from "next/head";

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
