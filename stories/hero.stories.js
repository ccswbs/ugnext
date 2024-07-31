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

export const SpotlightHero = {
	args: {
		variant: 'spotlight',
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
		alignment: 'left'
	},
};

export const SpotlightHeroWithCaption = {
	args: {
		variant: 'spotlight',
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		alignment: 'left'
	},
};

export const SpotlightHeroWithCaptionAndButton = {
	args: {
		variant: 'spotlight',
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		button: { body: 'Lorem Ipsum', href: '/example-page' },
		alignment: 'left'
	},
};

export const SpotlightHeroCenterAligned = {
	args: {
		variant: 'spotlight',
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		button: { body: 'Lorem Ipsum', href: '/example-page' },
		alignment: 'center'
	},
};

export const SpotlightHeroRightAligned = {
	args: {
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		button: { body: 'Lorem Ipsum', href: '/example-page' },
		alignment: 'right'
	},
};

export const SpotlightHeroFullWidth = {
	args: {
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
		caption: 'Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.',
		button: { body: 'Lorem Ipsum', href: '/example-page' },
		alignment: 'fullWidth'
	},
};

export const ContentHubHero = {
	args: {
		variant: 'content-hub',
		title: 'Lorem Ipsum',
		image: {
			src: 'https://picsum.photos/1680/640',
			height: 1680,
			width: 640,
			alt: 'Placeholder image',
		},
	},
};
