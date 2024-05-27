import { Hero } from '@/components/hero';

export const SpotlightHero = ({ hero }) => (
	<Hero
		title={hero.title}
		caption={hero.caption}
		href={hero.url.url}
		button={hero.url.title}
		src={hero.image.image.variations[0].url}
		alt={hero.image.image.alt}
		height={hero.image.image.height}
		width={hero.image.image.width}
		crop={hero.thumbnailImageCropping}
		alignment={hero.captionAlignment}
	/>
);
