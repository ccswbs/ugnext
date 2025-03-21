import { Card } from "@/components/card";
import { twJoin } from "tailwind-merge";

export const SpotlightCards = ({ cards }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {cards.map((card, index) => (
      <Card
        key={card.id}
        className={`h-full spotlight-card-rank-${index + 2}`}
        title={<span className="my-auto w-full text-center text-[2.2rem] leading-[3rem] font-bold">{card.title}</span>}
        href={card.url.url}
        centered
        image={{
          src: card.image.url,
          alt: card.image.alt,
          width: card.image.width,
          height: card.image.height,
          className: "aspect-[3/2] w-full",
          sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
        }}
      />
    ))}
  </div>
);
