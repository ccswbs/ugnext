import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { getPageMenu, getLegacyNewsList } from "@/data/drupal/legacy-news";
import Image from "next/image";
import { Divider } from "@/components/divider";
import {
  FormatDateFull,
  // FormatEventDate,
  // FormatEventDay,
  // FormatEventMonth,
  // FormatEventWeekday,
} from "@/lib/date-utils";

import { Link } from "@/components/link";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { useState } from "react";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;
  const content = {};
  content.title = "Ontario Veterinary College News Hub";
  content.menu = await getPageMenu();
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

function Pagination({ currentPage, totalPages, onPageClick, onNextPage, onPreviousPage }) {
  /**
   * Pagination Component
   *
   * @param {number} currentPage - The current active page number.
   * @param {number} totalPages - The total number of pages available.
   * @param {function} onPageClick - Callback function to handle clicking on a specific page number.
   * @param {function} onNextPage - Callback function to handle clicking the "Next" button.
   * @param {function} onPreviousPage - Callback function to handle clicking the "Previous" button.
   */

  // Calculate the range of page numbers to display
  const visiblePages = 5; // Limit the number of visible page numbers
  const startPage = Math.max(2, currentPage - Math.floor(visiblePages / 2)); // Start from the second page
  const endPage = Math.min(totalPages - 1, startPage + visiblePages - 1); // End before the last page

  const pageNumbers = [];
  if (startPage > 2) pageNumbers.push("...");
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < totalPages - 1) pageNumbers.push("...");

  return (
    <div
      className="pagination-controls flex justify-center items-center mt-6"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        aria-label="Previous page" // Added for screen readers
        className={`btn btn-primary px-4 py-2 mx-2 disabled:opacity-0 ${
          currentPage === 1 ? "" : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        <i class="fa-sharp-duotone fa-solid fa-chevrons-left"></i>
      </button>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageClick(1)}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-uog-color-yellow text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
          }`}
        >
          1
        </button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageClick(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-uog-color-yellow text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
              }`}
              aria-current={currentPage === page ? "page" : undefined} // Add aria-current for active page
            >
              {page}
            </button>
          )
        )}
        {totalPages > 1 && (
          <button
            onClick={() => onPageClick(totalPages)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-uog-color-yellow text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {totalPages}
          </button>
        )}
      </div>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page" // Added for screen readers
        className={`btn btn-primary px-4 py-2 mx-2 disabled:opacity-0 ${
          currentPage === totalPages ? "" : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        <i class="fa-sharp-duotone fa-solid fa-chevrons-right"></i>
      </button>
    </div>
  );
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
            <div key={index} className="border p-4 rounded shadow">
              <div className="relative w-full h-[225px] overflow-hidden rounded">
                <Image
                  src={legacyNews?.heroImage?.image.url || defaultImage}
                  alt={legacyNews?.heroImage?.image.alt || "OVC Front Entrance"}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
              <Link href={legacyNews?.path}>{legacyNews?.title}</Link>
              <p className="text-sm text-gray-500">{legacyNews?.articleDate}</p>
            </div>
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
