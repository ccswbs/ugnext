import { HomePage } from "@/pages/index";
import { getSpotlightCards, getSpotlightHero } from "@/data/drupal/home";

export async function getStaticProps(context) {
  const status = context?.preview || process.env.NODE_ENV !== "production" ? null : true;
  const hero = await getSpotlightHero(status);
  const cards = await getSpotlightCards(status, hero);

  return {
    props: {
      cards: cards,
      hero: hero,
    },
  };
}

export default function EnsTest({ cards, hero }) {
  return (
    <HomePage cards={cards} hero={hero} forceAppArmorTest />
  );
}
