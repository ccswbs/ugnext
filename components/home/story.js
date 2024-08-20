import foreground from '@/img/asha-edwin.png';
import background from '@/img/change-happens-banner.jpg';
import { Story } from '@/components/story';
import { Button } from '@/components/button';
import { Blockquote } from '@/components/blockquote';

export const HomeStory = () => (
	<>
		<Story
			foregroundImage={{
				src: foreground.src,
				width: foreground.width,
				height: foreground.height,
				blurred: foreground.blurDataURL,
				alt: 'Asha Edwin smiling',
				className: 'h-[370px] w-auto object-fit',
			}}
			backgroundImage={{
				src: background.src,
				width: background.width,
				height: background.height,
				blurred: background.blurDataURL,
				alt: 'Student volunteers',
				className: 'h-full w-full object-cover lg:[object-position:left_40px]',
			}}
			content={
				<Blockquote className="text-white text-sm">
					Pieces of experiential learning allow an opportunity for students to engage with their community, beyond the
					academic sphere, and for me that became pivotal...in shaping my life. ~ Asha Edwin, BA &apos;21
				</Blockquote>
			}
			footer={
				<div className="p-2">
					<span className="mr-1 text-2xl leading-tight">Learn how real-world education and experience will</span>
					<Button color="red" className="py-2 px-4 mx-[.25em] text-2xl">
						Improve Life
					</Button>
				</div>
			}
<<<<<<< HEAD
=======
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
>>>>>>> text_media_widget
		/>

		<div className="w-full p-2"></div>
	</>
);
