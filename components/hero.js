import Image from 'next/image';
import { twJoin } from 'tailwind-merge';
import { Button } from '@/components/button';

export const Hero = ({ src, height, width, alt, crop, title, caption, alignment, blurred, href, button }) => (
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
			placeholder={blurred ? 'blur' : 'empty'}
			blurDataURL={blurred}
		/>

		<div className="lg:max-w-max-content flex items-center lg:container lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:p-4">
			<div
				className={twJoin(
					'flex w-full bg-black p-7 text-white lg:bg-black/80 lg:backdrop-blur',
					alignment !== 'fullWidth' && 'lg:max-w-[50%]',
					alignment === 'center' && 'mx-auto',
					alignment === 'right' && 'ml-auto',
				)}
			>
				<div
					className={twJoin(
						'container mx-auto flex flex-col gap-5',
						alignment === 'center' && 'lg:text-center',
						alignment === 'right' && 'lg:text-right',
					)}
				>
					<h1 className="font-condensed text-3xl font-bold">{title}</h1>
					{caption && <span className="text-xl">{caption}</span>}
					{button && (
						<Button
							color="yellow"
							href={href}
							className={twJoin(
								'w-fit text-lg',
								alignment === 'center' && 'lg:mx-auto',
								alignment === 'right' && 'lg:ml-auto',
							)}
						>
							{button}
						</Button>
					)}
				</div>
			</div>
		</div>

		{/* Title Box */}
	</div>
);
