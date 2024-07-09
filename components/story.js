import { Button } from '@/components/button';
import { Quote } from '@/components/quote';

export const Story = ({ backgroundImage, foregroundImage, quote, ctaText, ctaButton }) => (
	<div className="flex w-full flex-col">
		<div className="relative flex w-full items-center justify-center overflow-hidden">
			<div className="absolute z-0 h-full max-h-full w-full">{backgroundImage}</div>

			<div className="container z-10 flex w-full max-w-max-content flex-col items-center gap-6 px-6 pt-6 lg:flex-row">
				<Quote>{quote}</Quote>
				<div className="flex justify-center w-full lg:w-1/2">{foregroundImage}</div>
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
