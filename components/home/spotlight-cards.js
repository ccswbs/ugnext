import { Card, CardContent, CardImage, CardTitle } from "@uoguelph/react-components/card";
import { UnstyledLink } from "@/components/link";
import Image from "next/image";

export const SpotlightCards = ({ cards }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {cards.map((card, index) => (
      <Card key={card.id} as={UnstyledLink} href={card.url.url} className="h-full" centered>
        <CardImage
          src={card.image.url}
          alt={card.image.alt}
          width={card.image.width}
          height={card.image.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="aspect-3/2 w-full"
          as={Image}
        />
        <CardContent className="flex-1">
          <CardTitle>{card.title}</CardTitle>
        </CardContent>
      </Card>
    ))}
  </div>
);
