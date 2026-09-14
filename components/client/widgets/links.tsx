import Image from "next/image";
import { Card, CardContent, CardTitle, CardImage } from "@uoguelph/react-components/card";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Link } from "@uoguelph/react-components/link";
import NextLink from "next/link";
import type { LinksFragment } from "@/lib/graphql/types";
import { Typography } from "@uoguelph/react-components/typography";
import { slugify } from "@/lib/string-utils";

export function LinksWidget({ data }: { data: LinksFragment }) {
  if (!data.links || data.links.length === 0) return null;

  const title = data.title?.trim();
  const description = data.linksDescription;
  const useCards = data.links.some((link) => Boolean(link.image));
  const containerClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:w-full gap-4";
  const cardClass = "h-full md:max-w-[32.2rem]";
  const cardImageClass = "aspect-[4/3] w-full object-cover";
  
  return (
    <div id={`links-${data.uuid}`} className="mb-5 py-4">
      {title && (
        <Typography id={slugify(title)} type="h2" as="h2" className="mb-4">
          {title}
        </Typography>
      )}
      {description && (
        <Typography type="body" as="p" className="mb-4">
          {description}
        </Typography>)
      }

      {useCards ? (
        <div className={containerClass}>
          {data.links?.map((link, index) => {
            const url = link.url?.url;
            const title = link.url?.title;
            const image = link.image?.image;

            if (!url) {
              return null;
            }

            return (
              <Card
                as={NextLink}
                id={`link-${data.uuid}`}
                href={url}
                className={cardClass}
                centered
                key={url + index}
              >
                {image && (
                  <CardImage
                    as={Image}
                    src={image.url}
                    width={image.width}
                    height={image.height}
                    alt={image.alt ?? ""}
                    className={cardImageClass}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                <CardContent>
                  <CardTitle className="my-auto text-center">{title}</CardTitle>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <List as="ul">
          {data?.links?.map((link, index) => {
            const url = link.url?.url;
            const title = link.url?.title;

            if (!url) {
              return null;
            }

            return (
              <ListItem key={url + index}>
                <Link as={NextLink} href={url}>
                  {title}
                </Link>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}
