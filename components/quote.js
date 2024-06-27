import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@awesome.me/kit-7993323d0c/icons/sharp/solid';
import { twMerge } from 'tailwind-merge';

export const Quote = ({ className, children }) => (
	<blockquote
		className={twMerge(
			'my-auto block h-fit w-5/6 text-center text-3xl font-thin italic text-white sm:text-4xl lg:w-1/2 lg:text-3xl xl:text-4xl',
			className,
		)}
	>
		<FontAwesomeIcon icon={faQuoteLeft} className="mr-[0.2em] inline-block h-[1em] text-yellow" />
		{children}
		<FontAwesomeIcon icon={faQuoteRight} className="ml-[0.2em] inline-block h-[1em] text-yellow" />
	</blockquote>
);
