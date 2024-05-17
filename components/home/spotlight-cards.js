import { Heading } from '@/components/heading';
import { Card } from '@/components/card';
import Image from 'next/image';
import { twJoin } from 'tailwind-merge';

export const SpotlightCards = ({ cards }) => (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{cards.map((card) => (
			<Card
				key={card.id}
				className="h-full"
				title={<span className="my-auto w-full text-center text-xl font-bold">{card.title}</span>}
				href={card.url.url}
				centered
				image={
					<Image
						className={twJoin(
							'aspect-[3/2] w-full',
							card.thumbnailImageCropping === 'right' && 'object-right',
							card.thumbnailImageCropping === 'left' && 'object-left',
							card.thumbnailImageCropping === 'center' && 'object-center',
						)}
						src={card.image.image.url}
						alt={card.image.image.alt}
						width={card.image.image.width}
						height={card.image.image.height}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
					/>
				}
			/>
		))}
	</div>
);
