import Image from "next/image";
import { Card, CardContent, CardTitle, CardImage } from "@uoguelph/react-components/card";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Link } from "@uoguelph/react-components/link";
import NextLink from "next/link";
import { tv } from "tailwind-variants";
import type { LinksFragment } from "@/lib/graphql/types";
import { Typography } from "@uoguelph/react-components/typography";

export function LinksWidget({ data }: { data: LinksFragment }) {
  if (!data.links || data.links.length === 0) return null;

  const useCards = data.links.some((link) => Boolean(link.image));
  const count = data.links.length ?? 0;
  const classes = tv({
    slots: {
      container: "mx-auto my-0 flex flex-col flex-wrap sm:flex-row gap-4",
      card: "h-full",
      cardImage: "aspect-[4/3] w-full object-cover",
    },
    variants: {
      divisibleByTwo: {
        true: {
          container: "",
        },
      },
      divisibleByThree: {
        true: {
          container: "",
        },
      },
      divisibleByFour: {
        true: {
          container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        },
      },
    },
    compoundVariants: [
      {
        divisibleByTwo: true,
        divisibleByThree: false,
        divisibleByFour: false,
        class: {
          container: "grid grid-cols-1 sm:grid-cols-2",
        },
      },
      {
        divisibleByThree: true,
        divisibleByFour: false,
        class: {
          container: "grid grid-cols-1 sm:grid-cols-3",
        },
      },
    ],
  })({
    divisibleByTwo: count % 2 === 0,
    divisibleByThree: count % 3 === 0,
    divisibleByFour: count % 4 === 0,
  });

  return (
    <div id={`links-${data.uuid}`} className="mb-5">
      {data.title && (
        <Typography id={`links-heading-${data.uuid}`} type="h2" as="h2" className="mb-4">
          {data.title}
        </Typography>
      )}

      {useCards ? (
        <div className={classes.container()}>
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
                className={classes.card()}
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
                    className={classes.cardImage()}
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
                <Link href={url}>{title}</Link>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}
