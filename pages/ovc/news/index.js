import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Container } from "@uoguelph/react-components/container";
import { Button } from "@uoguelph/react-components/button";
import { Typography } from "@uoguelph/react-components/typography";
import { UnstyledLink } from "@/components/unstyled-link";
import { getLegacyNewsList } from "@/data/drupal/ovc-news";
import { getPageMenu } from "@/data/drupal/basic-pages";
import { FormatDateFull } from "@/lib/date-utils";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { useState } from "react";
import { NewsCard } from "@/components/news-card";
import { Pagination } from "@/components/pagination";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import { Header } from "@uoguelph/react-components/header";
import { Meta } from "@/components/meta";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;
  const content = {};
  content.title = "Ontario Veterinary College News Hub";
  let OVCMenu = {};
  OVCMenu.primaryNavigation = {};
  OVCMenu.primaryNavigation.menuName = "ovc-main";
  content.menu = await getPageMenu(OVCMenu);
  content.img = null;

  // Get the OVC News feed

  content.legacyNewsList = await getLegacyNewsList();
  //  format the date created for each atricle
  content?.legacyNewsList.map((legacyNews) => {
    legacyNews.articleDate = FormatDateFull(legacyNews.created.time);
    legacyNews.path = "/ovc/news" + legacyNews.path;
  });
  // Flatten image prop
  content.image = content?.image?.image ?? null;

  return {
    props: { content },
  };
}

export default function Page({ content }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of news items per page
  const totalPages = Math.ceil(content?.legacyNewsList.length / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
    }
  };

  const paginatedNewsList = content?.legacyNewsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <Layout>
      <Meta title={content?.title} />

      <Header></Header>

      <LayoutContent>
        <Typography as="h1" type="h1" className="mb-0">
          {content?.title}
        </Typography>
        {/* Pagination Above */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageClick={handlePageClick}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
        <div className="mb-4" /> {/* Add space after pagination */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedNewsList.map((legacyNews, index) => (
            <NewsCard
              key={index}
              href={legacyNews?.path}
              image={{
                src: legacyNews?.heroImage?.image.url || defaultImage.src,
                alt: legacyNews?.heroImage?.image.alt || "OVC Front Entrance",
                width: legacyNews?.heroImage?.image.width || defaultImage.width,
                height: legacyNews?.heroImage?.image.height || defaultImage.height,
                sizes: legacyNews?.heroImage?.image.sizes || "33vw",
                blurred: legacyNews?.heroImage?.image.blurDataURL || defaultImage.blurDataURL,
              }}
              title={legacyNews?.title}
              className="border rounded shadow"
            >
              <p className="text-sm">{legacyNews?.articleDate}</p>
            </NewsCard>
          ))}
        </div>
        {/* Pagination Below */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageClick={handlePageClick}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
        <Button
          as={UnstyledLink}
          href="https://www.uoguelph.ca/ovc/newsarchive/"
          color="red"
          className="py-2 px-4 mx-[.25em] text-2xl"
        >
          OVC News Archive
        </Button>
        <OVCFooter />
      </LayoutContent>
    </Layout>
  );
}
