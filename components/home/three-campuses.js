import { Card } from '@/components/card';
import guelph from '@/img/guelph.png';
import ridgetown from '@/img/ridgetown.png';
import guelphHumber from '@/img/guelph-humber.png';
import Image from 'next/image';

export const ThreeCampuses = () => {
	const campuses = [
		{
			title: 'Guelph',
			url: 'https://admission.uoguelph.ca/campus-tour-highlights',
			image: { src: guelph, alt: 'An aerial view of Johnston Hall and the University of Guelph campus' },
		},
		{
			title: 'Ridgetown',
			url: 'https://www.ridgetownc.com/',
			image: { src: ridgetown, alt: 'An aerial view of the Ridgetown Campus' },
		},
		{
			title: 'Guelph-Humber',
			url: 'https://www.guelphhumber.ca/',
			image: { src: guelphHumber, alt: 'The main building of the University of Guelph-Humber campus' },
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{campuses.map((campus, index) => (
				<Card
					key={campus.title}
					className="h-full"
					title={<span className="my-auto w-full text-center text-xl font-bold">{`${campus.title} Campus`}</span>}
					href={campus.url}
					centered
					image={<Image className="aspect-[3/2] w-full" src={campus.image.src} alt={campus.image.alt} />}
				/>
			))}
		</div>
	);
};
