import { Layout } from "@/components/layout";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { getPageID, getLegacyNews, getPageMenu, getLegacyNewsList } from "@/data/drupal/legacy-news";
import { getFeaturedLegacyNews } from "@/data/drupal/ovchome";
import { WidgetSelector } from "@/components/widgets/widget-selector";
import Image from "next/image";
import ovcCrest from "@/img/ovc/OVC-crest.png";
import { Divider } from "@/components/divider";
import {
  FormatDateFull,
  // FormatEventDate,
  // FormatEventDay,
  // FormatEventMonth,
  // FormatEventWeekday,
} from "@/lib/date-utils";
import { twMerge } from "tailwind-merge";
import { OVCCards } from "@/components/ovchome/ovc-cards";
import { Link } from "@/components/link";
import { OVCFooter } from "@/components/ovc/ovc-footer";
import { useState } from "react";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;

  //   // Try to get the ID of the page the user is requesting.
  //   const id = await getPageID("/ovc");

  //   // If we couldn't resolve an id, then that means this page doesn't exist on content hub, show a 404.
  //   if (!id) {
  //     return {
  //       notFound: true,
  //     };
  //   }

  //   // Now that we have the ID for the page we can request its content from its latest revision.
  //   const content = await getPageContent(id, status);

  //   if (!content) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  const content = {};
  content.title = "Ontario Veterinary College News Hub";
  content.menu = await getPageMenu();
  content.img = null;

  //   // Get the featured OVC News - last 3 entered

  content.legacyNewsList = await getLegacyNewsList();
  //  format the date created for each atricle
  content?.legacyNewsList.map((legacyNews) => {
    legacyNews.articleDate = FormatDateFull(legacyNews.created.time);
    legacyNews.path = "/ovc/news" + legacyNews.path;
  });
  console.log(content);

  //   // Get rid of any data that doesn't need to be passed to the page.
  //   delete content.primaryNavigation;

  // Flatten image prop
  content.image = content?.image?.image ?? null;

  //   //   content.breadcrumbs = (await getBreadcrumbs(context.params.slug)) ?? [];

  return {
    props: { content },
  };
}

export default function Page({ content }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of news items per page
  const totalPages = Math.ceil(content?.legacyNewsList.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };
  
  const paginatedNewsList = content?.legacyNewsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate the range of page numbers to display
  const visiblePages = 5; // Limit the number of visible page numbers
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedNewsList.map((legacyNews, index) => (
            <div key={index} className="border p-4 rounded shadow">
              {legacyNews?.heroImage !== null && (
                <Image
                  src={legacyNews?.heroImage?.image.url}
                  width={legacyNews?.heroImage?.image.width}
                  height={legacyNews?.heroImage?.image.height}
                  blurred={legacyNews?.heroImage?.image.blurDataURL}
                  alt={legacyNews?.heroImage?.image.alt}
                  className="rounded"
                />
              )}
              <Heading level={3} as={"h3"} className="font-condensed text-dark mt-2">
                <Link href={legacyNews?.path}>{legacyNews?.title}</Link>
              </Heading>
              <p className="text-sm text-gray-500">{legacyNews?.articleDate}</p>
            </div>
          ))}
        </div>
        <div className="pagination-controls flex justify-center items-center mt-6">
          <button
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            className="btn btn-primary px-4 py-2 mx-2 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn btn-primary px-4 py-2 mx-2 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
              const page = startPage + index;
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-primary px-4 py-2 mx-2 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            className="btn btn-primary px-4 py-2 mx-2 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </Container>
      <OVCFooter />
    </Layout>
  );
}
