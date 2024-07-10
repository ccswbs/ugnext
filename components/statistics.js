import { twJoin } from 'tailwind-merge';
import useResizeObserver from 'use-resize-observer';
import Image from 'next/image';

export const Statistics = ({ data, variant = 'gradient-of-solid-colours' }) => {
	const divisibleByTwo = data.length % 2 === 0;
	const divisibleByThree = data.length % 3 === 0;
	const divisibleByFour = data.length % 4 === 0;

	const colors = [
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-black text-white',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-black',
		),
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-red text-white',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-red',
		),
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-yellow text-black',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-yellow',
		),
		twJoin(
			(variant === 'gradient-of-solid-colours' || variant === 'solid-colours') && 'bg-light-blue text-black',
			(variant === 'light-blue' || variant === 'left-border') && 'bg-light-blue-50 text-black',
			variant === 'left-border' && 'border-l-[1rem] border-light-blue',
		),
	];

	const gradientClasses = twJoin(
		'sm:before:content-[""]',
		'before:absolute',
		'before:top-0',
		'before:right-full',
		'before:w-[calc((100vw-var(--statistic-bg-width))/2)]',
		'before:h-full',
		'before:bg-inherit',
		'before:z-[-1]',
		'first:before:z-0',
		'sm:after:content-[""]',
		'after:absolute',
		'after:top-0',
		'after:left-full',
		'after:w-[calc((100vw-var(--statistic-bg-width))/2)]',
		'after:h-full',
		'after:bg-inherit',
		'after:z-[-1]',
		'last:after:z-0',
	);

	const { ref, width } = useResizeObserver();

	return (
		<dl
			className={twJoin(
				'mx-auto my-4 flex flex-col flex-wrap sm:flex-row',
				divisibleByFour && 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
				divisibleByThree && !divisibleByFour && 'grid grid-cols-1 lg:grid-cols-3',
				divisibleByTwo && !divisibleByFour && 'grid grid-cols-1 sm:grid-cols-2',
				variant !== 'gradient-of-solid-colours' && 'gap-4',
			)}
			style={variant === 'gradient-of-solid-colours' ? { '--statistic-bg-width': width + 'px' } : undefined}
			ref={variant === 'gradient-of-solid-colours' ? ref : undefined}
		>
			{data.map((statistic, index) => {
				const color = colors[index % colors.length];
				const { represents, value, image } = statistic;

				return (
					<div
						key={index}
						className={twJoin(
							'relative flex flex-1 flex-col justify-around gap-2',
							variant === 'gradient-of-solid-colours' && gradientClasses,
							color,
						)}
					>
						<dt className="hyphens-auto break-words p-6 pb-0 text-center text-xl font-bold leading-tight md:text-3xl">
							{value}
						</dt>
						<dd className="text-normal p-6 pt-0 text-center font-normal md:text-lg">{represents}</dd>

						{image && (
							<Image
								width={image.image.width}
								height={image.image.height}
								src={image.image.url}
								alt={image.image.alt}
								className="w-full"
							/>
						)}
					</div>
				);
			})}
		</dl>
	);
};
