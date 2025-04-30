import Image from "next/image";
import { Card, CardContent, CardTitle, CardImage } from "@uoguelph/react-components/card";
import { List, ListItem } from "@uoguelph/react-components/list";
import { Link } from "@uoguelph/react-components/link";
import { UnstyledLink } from "@/components/link";

export const Links = ({ data }) => {
  const useCards = data?.links?.every((link) => Boolean(link.image));

  if (useCards) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.links?.map((link, index) => (
          <Card as={UnstyledLink} href={link.url.url} className="h-full" centered key={link.url.title + index}>
            <CardImage
              as={Image}
              src={link.image.image.url}
              width={link.image.image.width}
              height={link.image.image.height}
              alt={link.image.image.alt}
              className="aspect-[4/3] w-full"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <CardContent>
              <CardTitle>{link.url.title}</CardTitle>
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
};
