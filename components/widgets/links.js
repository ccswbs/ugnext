import { Card } from '@/components/card';
import Image from 'next/image';
import { twJoin } from 'tailwind-merge';
import { List, ListItem } from '@/components/list';
import { Link } from '@/components/link';

export const Links = ({ data }) => {
  const useCards = data?.links?.every((link) => Boolean(link.image));

  if (useCards) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.links?.map((link, index) => (
          <Card
            key={link.url.title + index}
            className="h-full"
            title={<span className="my-auto w-full text-center text-xl font-bold">{link.url.title}</span>}
            href={link.url.url}
            centered
            image={{
              src: link.image.image.url,
              alt: link.image.image.alt,
              width: link.image.image.width,
              height: link.image.image.height,
              className: 'aspect-[4/3] w-full',
              sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <List>
      {data?.links?.map((link, index) => (
        <ListItem key={link.url.title + index}>
          <Link href={link.url.url}>{link.url.title}</Link>
        </ListItem>
      ))}
    </List>
  );
};
