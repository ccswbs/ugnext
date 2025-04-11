import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { getPageMenu, getLegacyNewsList } from "@/data/drupal/legacy-news";
import { Button } from "@/components/button";
import {
  FormatDateFull,
  // FormatEventDate,
  // FormatEventDay,
  // FormatEventMonth,
  // FormatEventWeekday,
} from "@/lib/date-utils";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { useState } from "react";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import { OVCNewsCard } from "@/components/ovc/ovc-news-card";
import { Pagination } from "@/components/pagination";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;
  const content = {};
  content.title = "Ontario Veterinary College News Archive - Prior to April 2025";
  content.menu = await getPageMenu();
  content.img = null;

  // Get the OVC News feed

  content.legacyNewsList = await getLegacyNewsList();
  //  format the date created for each atricle
  content?.legacyNewsList.map((legacyNews) => {
    legacyNews.articleDate = FormatDateFull(legacyNews.created.time);
    legacyNews.path = "/ovc/news/archive" + legacyNews.path;
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
    <Layout metadata={{ title: content?.title }} header={content?.menu}>
      <>
        <Container centered>
          <Heading level={1} className="mb-0">
            {content?.title}
          </Heading>
          <Button href="https://ss-ugnext.netlify.app/ovc/news" color="red" className="py-2 px-4 mx-[.25em] text-2xl">
          OVC News Hub (Current News)
        </Button>
        </Container>
      </>
      <Container centered>
        {/* Pagination Above */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageClick={handlePageClick}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedNewsList.map((legacyNews, index) => (
            <OVCNewsCard
              key={index}
              href={legacyNews?.path}
              image={{
                src: legacyNews?.heroImage?.image.url || defaultImage,
                alt: legacyNews?.heroImage?.image.alt || "OVC Front Entrance",
                width: legacyNews?.heroImage?.image.width,
                height: legacyNews?.heroImage?.image.height,
                blurred: legacyNews?.heroImage?.image.blurDataURL, // Optional: Add blur placeholder
              }}
              title={legacyNews?.title}
              className="border rounded shadow"
            >
              <p className="text-sm">{legacyNews?.articleDate}</p>
            </OVCNewsCard>
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
      </Container>
      <OVCFooter />
    </Layout>
  );
}
