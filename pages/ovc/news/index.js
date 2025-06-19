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
import { Pagination } from "@uoguelph/react-components/pagination";
import defaultImage from "@/img/ovc/OVC_front_entrance.jpeg";
import { Header } from "@/components/header";
import { Meta } from "@/components/meta";
import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import Image from "next/image";

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

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Scroll to the top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const paginatedNewsList = content?.legacyNewsList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Layout>
      <Meta title={content?.title} />

      <Header title={content?.menu?.topic?.title} url={content?.menu?.topic?.url} menu={content?.menu?.navigation} />

      <LayoutContent container={false}>
        <Container>
          <Typography as="h1" type="h1" className="">
            {content?.title}
          </Typography>

          {/* Pagination Above */}
          <Pagination
            color="yellow"
            count={totalPages}
            visible={5}
            page={currentPage}
            hideInput
            onChange={handlePageChange}
            className="pt-8! pb-8!"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedNewsList.map((legacyNews, index) => (
              <Card
                key={index}
                as={UnstyledLink}
                href={legacyNews?.path}
                className="border border-grey-light rounded shadow"
              >
                <CardImage
                  as={Image}
                  src={legacyNews?.heroImage?.image.url || defaultImage.src}
                  alt={legacyNews?.heroImage?.image.alt || "OVC Front Entrance"}
                  width={legacyNews?.heroImage?.image.width || defaultImage.width}
                  height={legacyNews?.heroImage?.image.height || defaultImage.height}
                  sizes={legacyNews?.heroImage?.image.sizes || "33vw"}
                  blurred={legacyNews?.heroImage?.image.blurDataURL || defaultImage.blurDataURL}
                  className="aspect-[9/4]"
                />

                <CardContent>
                  <CardTitle>{legacyNews?.title}</CardTitle>

                  <p className="text-sm mt-auto">{legacyNews?.articleDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Below */}
          <Pagination
            color="yellow"
            count={totalPages}
            visible={5}
            page={currentPage}
            hideInput
            onChange={handlePageChange}
            className="pt-8!"
          />

          <Button
            as={UnstyledLink}
            href="https://www.uoguelph.ca/ovc/newsarchive/"
            color="red"
            className="py-2 px-4 mx-[.25em] text-2xl"
          >
            OVC News Archive
          </Button>
        </Container>
        <OVCFooter />
      </LayoutContent>
    </Layout>
  );
}
