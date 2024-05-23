import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@awesome.me/kit-7993323d0c/icons/sharp/solid';

export const Story = ({ backgroundImage, foregroundImage, quote, ctaText, ctaButton }) => (
	<div className="flex w-full flex-col">
		<div className="relative flex w-full items-center justify-center overflow-hidden">
			<div className="absolute z-0 h-full max-h-full w-full">{backgroundImage}</div>

			<div className="container z-10 flex w-full flex-col items-center gap-6 px-6 pt-6 lg:flex-row">
				<blockquote className="my-auto block h-fit w-5/6 text-center text-3xl font-thin italic text-white sm:text-4xl lg:w-1/2 lg:text-3xl xl:text-4xl">
					<FontAwesomeIcon icon={faQuoteLeft} className="mr-[0.2em] inline-block h-[1em] text-yellow" />
					{quote}
					<FontAwesomeIcon icon={faQuoteRight} className="ml-[0.2em] inline-block h-[1em] text-yellow" />
				</blockquote>
				<div className="w-full lg:w-1/2">{foregroundImage}</div>
			</div>
		</div>

		<div className="flex w-full items-center justify-center bg-black p-4 text-white">
			<div className="text-xl">
				<span className="mr-1 font-bold leading-tight">{ctaText}</span>
				<Button color="red" className="p-2">
					{ctaButton}
				</Button>
			</div>
		</div>
	</div>
);
