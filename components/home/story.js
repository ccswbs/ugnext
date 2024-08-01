import Image from 'next/image';
import foreground from '@/img/meal-care-students.png';
import background from '@/img/change-happens-banner.jpg';
import { Story } from '@/components/story';
import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@awesome.me/kit-7993323d0c/icons/sharp/solid';
import { Blockquote } from '@/components/blockquote';

export const HomeStory = () => (
	<>
		<Story
			foregroundImage={{
				src: foreground,
				alt: 'Kiana Gibson and David Sahai, co-founders of MealCare Guelph',
			}}
			backgroundImage={{
				src: background,
				alt: 'tudent volunteers',
				className: 'h-full w-full object-cover lg:[object-position:left_40px]',
			}}
			content={
				<Blockquote className="text-white">
					Change happens at the community level. Small groups put in small efforts and those efforts add up to something
					big.
				</Blockquote>
			}
			footer={
				<>
					<span className="mr-1 font-bold leading-tight">
						Learn more about how the University of Guelph is working to
					</span>
					<Button color="red" className="p-2">
						Improve Life
					</Button>
				</>
			}
		/>

		<div className="w-full p-2"></div>
	</>
);
