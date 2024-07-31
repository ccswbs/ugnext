import { Hero } from '@/components/hero';

export const SpotlightHero = ({ hero }) => (
	<Hero
		variant="spotlight"
		title={hero.title}
		image={{
			src: hero.image.image.variations[0].url,
			alt: hero.image.image.alt,
			width: hero.image.image.width,
			height: hero.image.image.height,
			crop: hero.thumbnailImageCropping,
		}}
		caption={hero.caption}
		button={{
			body: hero.url.title,
			href: hero.url.href,
		}}
		alignment={hero.captionAlignment}
	/>
);
