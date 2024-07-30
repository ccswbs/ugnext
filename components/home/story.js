import Image from 'next/image';
import foreground from '@/img/meal-care-students.png';
import background from '@/img/change-happens-banner.jpg';
import { Story } from '@/components/story';
import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@awesome.me/kit-7993323d0c/icons/sharp/solid';

export const HomeStory = () => (
	<>
		<Story
			foregroundImage={
				<Image src={foreground} alt="Kiana Gibson and David Sahai, co-founders of MealCare Guelph" sizes="50vw" />
			}
			backgroundImage={
				<Image
					className="h-full w-full object-cover lg:[object-position:left_40px]"
					src={background}
					alt="Student volunteers"
					sizes="100vw"
				/>
			}
			content={
				<blockquote className="block w-full text-center text-3xl font-thin italic text-white sm:text-4xl lg:text-3xl xl:text-4xl">
					<FontAwesomeIcon icon={faQuoteLeft} className="mr-[0.2em] inline-block h-[1em] text-yellow" />
					<span>
						Change happens at the community level. Small groups put in small efforts and those efforts add up to
						something big.
					</span>
					<FontAwesomeIcon icon={faQuoteRight} className="ml-[0.2em] inline-block h-[1em] text-yellow" />
				</blockquote>
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
