import { Hero } from '@/components/hero';

const config = {
	title: 'Components/Hero',
	component: Hero,
	parameters: {
		layout: 'fullScreen',
		docs: {
			toc: true,
		},
	},
	tags: ['autodocs'],
};

export default config;

export const SpotlightHeroLeftCaption = {
	args: {
		variant: 'spotlight',
		src: 'https://picsum.photos/1680/640',
		height: 1680,
		width: 640,
		alt: 'Placeholder image',
		crop: 'left',
		title: 'Lorem Ipsum',
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		alignment: 'left',
		href: '/example-page',
		button: 'Lorem Ipsum',
	}
};

export const SpotlightHeroCenterCaption = {
	args: {
		variant: 'spotlight',
		src: 'https://picsum.photos/1680/640',
		height: 1680,
		width: 640,
		alt: 'Placeholder image',
		crop: 'left',
		title: 'Lorem Ipsum',
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		alignment: 'center',
		href: '/example-page',
		button: 'Lorem Ipsum',
	}
};

export const SpotlightHeroRightCaption = {
	args: {
		variant: 'spotlight',
		src: 'https://picsum.photos/1680/640',
		height: 1680,
		width: 640,
		alt: 'Placeholder image',
		crop: 'left',
		title: 'Lorem Ipsum',
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		alignment: 'right',
		href: '/example-page',
		button: 'Lorem Ipsum',
	}
};

export const SpotlightHeroFullWidthCaption = {
	args: {
		variant: 'spotlight',
		src: 'https://picsum.photos/1680/640',
		height: 1680,
		width: 640,
		alt: 'Placeholder image',
		crop: 'left',
		title: 'Lorem Ipsum',
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		alignment: 'fullWidth',
		href: '/example-page',
		button: 'Lorem Ipsum',
	}
};

export const ContentHubHero = {
	args: {
		variant: 'content-hub',
		src: 'https://picsum.photos/1680/640',
		height: 1680,
		width: 640,
		alt: 'Placeholder image',
		title: 'Lorem Ipsum',
	}
};