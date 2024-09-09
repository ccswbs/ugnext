import { Hero } from '@/components/hero';
import { twJoin } from 'tailwind-merge';

export const SpotlightHero = ({ hero }) => (
	<Hero
		variant="spotlight"
		title={hero.title}
		image={{
			src: hero.image.image.variations[0].url,
			alt: hero.image.image.alt,
			width: hero.image.image.width,
			height: hero.image.image.height,
			className: twJoin(
				'aspect-[3/2] w-full',
				hero.thumbnailImageCropping === 'right' && 'object-right',
				hero.thumbnailImageCropping === 'left' && 'object-left',
				(hero.thumbnailImageCropping === 'center' || !hero.thumbnailImageCropping) && 'object-center',
			),
		}}
		caption={hero.caption}
		button={{
			body: hero.url.title,
			href: hero.url.href,
		}}
		alignment={hero.captionAlignment}
	/>
);
