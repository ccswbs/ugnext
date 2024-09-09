import { LinkCarousel } from '@/components/link-carousel';

const config = {
	title: 'Components/LinkCarousel',
	component: LinkCarousel,
	parameters: {
		layout: 'padded',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
};

export default config;

export const Default = {
	args: {
		links: [
			{
				image: {
					src: 'https://picsum.photos/seed/first/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
					className: 'w-full',
				},
				title: 'Example Link 1',
				url: 'https://admission.uoguelph.ca/programs',
			},
			{
				image: {
					src: 'https://picsum.photos/seed/second/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
				},
				title: 'Example Link 2',
				url: 'https://graduatestudies.uoguelph.ca/',
			},
			{
				image: {
					src: 'https://picsum.photos/seed/third/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
				},
				title: 'Example Link 3',
				url: 'https://www.uoguelph.ca/study-in-canada/',
			},
			{
				image: {
					src: 'https://picsum.photos/seed/forth/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
				},
				title: 'Example Link 4',
				url: 'https://opened.uoguelph.ca/',
			},
		],
	},
};

export const WithCaptions = {
	args: {
		links: [
			{
				image: {
					src: 'https://picsum.photos/seed/first/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
					className: 'w-full',
				},
				title: 'Example Link 1',
				url: 'https://admission.uoguelph.ca/programs',
				caption: 'Caption for Example Link 1',
			},
			{
				image: {
					src: 'https://picsum.photos/seed/second/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
				},
				title: 'Example Link 2',
				url: 'https://graduatestudies.uoguelph.ca/',
				caption: 'Caption for Example Link 2',
			},
			{
				image: {
					src: 'https://picsum.photos/seed/third/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
				},
				title: 'Example Link 3',
				url: 'https://www.uoguelph.ca/study-in-canada/',
				caption: 'Caption for Example Link 3',
			},
			{
				image: {
					src: 'https://picsum.photos/seed/forth/1680/640',
					height: 1680,
					width: 640,
					alt: 'Placeholder image',
				},
				title: 'Example Link 4',
				url: 'https://opened.uoguelph.ca/',
				caption: 'Caption for Example Link 4',
			},
		],
	},
};
