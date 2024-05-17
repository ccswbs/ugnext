import Image from 'next/image';
import foreground from '@/img/meal-care-students.png';
import background from '@/img/change-happens-banner.jpg';
import { Story } from '@/components/story';

export const HomeStory = () => (
	<>
		<Story
			foregroundImage={<Image src={foreground} alt="Kiana Gibson and David Sahai, co-founders of MealCare Guelph" />}
			backgroundImage={
				<Image
					className="h-full w-full object-cover lg:[object-position:left_40px]"
					src={background}
					alt="Student volunteers"
				/>
			}
			quote="Change happens at the community level. Small groups put in small efforts and those efforts add up to something big."
			ctaText="Learn more about how the University of Guelph is working to"
			ctaButton="Improve Life"
		/>

		<div className="w-full p-2"></div>
	</>
);
