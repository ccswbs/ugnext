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
			},
			title: 'Undergraduate Programs',
			url: 'https://admission.uoguelph.ca/programs',
		},
		{
			image: {
				caption: 'Caroline Pottruff - Landscape Architecture',
				url: graduate,
			},
			title: 'Graduate Programs',
			url: 'https://graduatestudies.uoguelph.ca/',
		},
		{
			image: {
				caption: 'Ryan Ahlers - Theatre Studies',
				url: international,
			},
			title: 'International',
			url: 'https://www.uoguelph.ca/study-in-canada/',
		},
		{
			image: {
				caption: 'Kathryn Knowles & Jenna Schamowski - Environmental Sciences',
				url: lifelong,
			},
			title: 'Lifelong Learning',
			url: 'https://opened.uoguelph.ca/',
		},
	];

	return <LinkCarousel links={links} />;
};
