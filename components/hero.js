import Image from 'next/image';
import { twJoin } from 'tailwind-merge';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Container } from '@/components/container';
import PropTypes from 'prop-types';

export const Hero = ({
	variant = 'spotlight',
	src,
	height,
	width,
	alt,
	crop = 'center',
	title,
	caption,
	alignment = 'left',
	blurred,
	href,
	button,
}) => {
	return (
		<div className={twJoin('relative flex w-full flex-col overflow-hidden', variant !== 'spotlight' && ' h-fit')}>
			<Image
				className={twJoin(
					'aspect-[16/9] w-full object-cover md:aspect-[2.625]',
					crop === 'right' && 'object-right',
					crop === 'left' && 'object-left',
					crop === 'center' && 'object-center',
					variant === 'spotlight' ? 'max-h-[80vh] ' : 'max-h-[calc(85vh-14rem)]',
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

			{variant === 'spotlight' && (
				<div className="flex items-center lg:container lg:absolute lg:bottom-0 lg:left-1/2 lg:max-w-max-content lg:-translate-x-1/2 lg:p-4">
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
			)}

			{variant !== 'spotlight' && (
				<Container centered className="absolute bottom-0 left-1/2 h-fit w-full -translate-x-1/2 p-0">
					<Heading level={1} className="mb-0 w-fit bg-yellow p-1 text-3xl text-black md:text-4xl">
						{title}
					</Heading>
				</Container>
			)}
		</div>
	);
};

Hero.propTypes = {
	variant: PropTypes.oneOf(['spotlight', 'content-hub']),
	src: PropTypes.string.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	alt: PropTypes.string.isRequired,
	/**
	 * How the image will be cropped when displayed on smaller devices
	 */
	crop: PropTypes.oneOf(['left', 'center', 'right']),
	/**
	 * The main title displayed in the hero's caption box
	 */
	title: PropTypes.string.isRequired,
	/**
	 * A short paragraph to display in the hero's caption box (does nothing for content-hub variant)
	 */
	caption: PropTypes.string,
	/**
	 * Determines where the caption box will be displayed (does nothing for content-hub variant)
	 */
	alignment: PropTypes.oneOf(['left', 'center', 'right', 'fullWidth']),
	/**
	 * A data uri for an image to display while the main hero image is loading.
	 */
	blurred: PropTypes.string,
	/**
	 * The url the button displayed in the hero caption navigates to (does nothing for content-hub variant)
	 */
	href: PropTypes.string,
	/**
	 * The text for the button that is displayed in the hero caption (does nothing for content-hub variant)
	 */
	button: PropTypes.string,
};
