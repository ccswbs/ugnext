import Image from 'next/image';
import { twJoin } from 'tailwind-merge';
import { Button } from '@/components/button';

export const Hero = ({ src, height, width, alt, crop, title, caption, alignment, href, button }) => {
	return (
		<div className="relative flex w-full flex-col overflow-hidden">
			<Image
				className={twJoin(
					'aspect-[16/9] max-h-[80vh] w-full object-cover md:aspect-[2.625]',
					crop === 'right' && 'object-right',
					crop === 'left' && 'object-left',
					crop === 'center' && 'object-center',
				)}
				src={src}
				alt={alt}
				width={width}
				height={height}
				priority
				sizes="100vw"
			/>

			<div className="flex items-center lg:container lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:p-4">
				<div className="flex w-full bg-black p-7 text-white lg:max-w-[50%] lg:bg-black/80 lg:backdrop-blur">
					<div className="container mx-auto flex flex-col gap-5">
						<h1 className="font-condensed text-3xl font-bold">{title}</h1>
						{caption && <span className="text-xl">{caption}</span>}
						{button && (
							<Button color="yellow" href={href} className="w-fit text-lg">
								{button}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Title Box */}
		</div>
	);
};
