import Image from "next/image";
import { Card, CardContent, CardTitle, CardImage } from "@uoguelph/react-components/card";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Link } from "@uoguelph/react-components/link";
import NextLink from "next/link";
import { tv } from "tailwind-variants";

export function LinksWidget({ data }) {
  const useCards = data?.links?.some((link) => Boolean(link.image));
  const classes = tv({
    slots: {
      container: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
      card: "h-full",
      cardImage: "aspect-[4/3] w-full object-cover",
    },
  })();

  if (useCards) {
    return (
      <div id={`links-${data.uuid}`} className={classes.container()}>
        {data?.links?.map((link, index) => (
          <Card
            as={NextLink}
            id={`link-${data.uuid}`}
            href={link.url.url}
            className={classes.card()}
            centered
            key={link.url.title + index}
          >
            {link.image?.image?.url && (
              <CardImage
                as={Image}
                src={link.image.image.url}
                width={link.image.image.width}
                height={link.image.image.height}
                alt={link.image.image.alt}
                className={classes.cardImage()}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}

            <CardContent>
              <CardTitle className="my-auto text-center">{link.url.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <List as="ul">
      {data?.links?.map((link, index) => (
        <ListItem key={link.url.title + index}>
          <Link href={link.url.url}>{link.url.title}</Link>
        </ListItem>
      ))}
    </List>
  );
}
