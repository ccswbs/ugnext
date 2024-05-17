import { LinkCarousel } from '@/components/link-carousel';
import undergraduate from '@/img/leah-weller-environmental-engineering-u-of-g.jpg';
import graduate from '@/img/caroline-pottruff-landscape-architecture-u-of-g.jpg';
import international from '@/img/ryan-ahlers-theatre-studies-u-of-g.jpg';
import lifelong from '@/img/kathryn-knowles-jenna-schamowski-environmental-sciences-u-of-g.jpg';

export const StudyHere = () => {
	const links = [
		{
			image: {
				caption: 'Leah Weller - Environmental Engineering',
				url: undergraduate,
				alt: 'Leah Weller and another student in lab coats looking at a computer screen.',
			},
			title: 'Undergraduate Programs',
			url: 'https://admission.uoguelph.ca/programs',
		},
		{
			image: {
				caption: 'Caroline Pottruff - Landscape Architecture',
				url: graduate,
				alt: 'Caroline Pottruff working in a forest with a hard hat on',
			},
			title: 'Graduate Programs',
			url: 'https://graduatestudies.uoguelph.ca/',
		},
		{
			image: {
				caption: 'Ryan Ahlers - Theatre Studies',
				url: international,
				alt: 'Ryan Ahlers adjusting a spotlight in a theatre',
			},
			title: 'International',
			url: 'https://www.uoguelph.ca/study-in-canada/',
		},
		{
			image: {
				caption: 'Kathryn Knowles & Jenna Schamowski - Environmental Sciences',
				url: lifelong,
				alt: 'Kathryn Knowles & Jenna Schamowski working with bee hives',
			},
			title: 'Lifelong Learning',
			url: 'https://opened.uoguelph.ca/',
		},
	];

	return <LinkCarousel links={links} />;
};
