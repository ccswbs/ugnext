import React from 'react';

// Source: https://www.labnol.org/code/19797-regex-youtube-id

export function extractVideoID(url) {
	let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#]*).*/;
	let match = url.match(regExp);

	if (match) {
		return match[7].split('?')[0];
	} else {
		console.log('Could not extract video ID.');
	}
}

export function computeLayoutMediaText(data) {
	const region = data.region;
	const mediaDescription = data?.mediaDescription;
	const mediaBgColor = data?.mediaBgColor;

	const mediaSize = data?.mediaSize;
	const imageURL = data?.imageURL;
	const videoURL = data?.videoURL;
	const mediaButtons = data?.mediaButtons;
	const mediaAlignment = data?.mediaAlignment;

	let mediaCol = 'w-full';
	let textCol = 'w-full';
	let leftDivClasses = '';
	let rightDivClasses = '';

	let headingClass = '';
	let textColPadding = '';
	let textColHeight = '';
	let wrapperCol = '';

	const colorClasses = {
		'Light Blue': { textColBg: 'bg-uog-blue-muted', headingColor: 'text-black' },
		'Dark Gray': { textColBg: 'bg-grey-950', headingColor: 'text-white' },
	};

	let { textColBg = '', headingColor = 'text-black' } = colorClasses[mediaBgColor] || {};

	// Set the order classes based on the media alignment
	// If mediaAlignment is "left", align left content to the start and right content to the end
	// Otherwise, align left content to the end and right content to the start
	leftDivClasses = mediaAlignment == 'left' ? 'order-1' : 'order-2';
	rightDivClasses = mediaAlignment == 'right' ? 'order-1' : 'order-2';

	function getMediaClasses(region, mediaSize, textColBg, mediaDescription, mediaButtons) {
		const commonClasses = {
			headingClass: 'mt-md-0',
			textColPadding: textColBg ? 'p-4' : '',
		};

		const classes = {
			Primary: {
				withDescription: {
					small: { ...commonClasses, mediaCol: 'md:w-1/3', textCol: 'md:w-2/3', wrapperCol: 'w-full mt-4' },
					medium: { ...commonClasses, mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', wrapperCol: 'w-full mt-4' },
					large: {
						mediaCol: 'w-full',
						textCol: 'w-full',
						textColHeight: 'h-full',
						wrapperCol: 'w-full mb-4 border-0 card',
					},
					default: {
						mediaCol: 'w-full',
						textCol: 'w-full',
						textColHeight: 'h-full',
						wrapperCol: 'sm:w-auto mb-3 border-0 card',
					},
				},
				withoutDescription: {
					small: { mediaCol: 'md:w-1/3' },
					medium: { mediaCol: 'md:w-1/2' },
					large: { mediaCol: 'w-full' },
					default: { mediaCol: 'sm:w-auto mb-3' },
				},
				video: {
					small: { wrapperCol: 'md:w-1/3 border-0 card mb-4' },
					medium: { wrapperCol: 'w-full border-0 card mb-4' },
					large: { wrapperCol: 'w-full border-0 card mb-4' },
					default: { wrapperCol: 'sm:w-auto border-0 card mb-4' },
				},
			},
			NullRegion: {
				withDescription: {
					small: { ...commonClasses, mediaCol: 'md:w-1/4', textCol: 'md:w-3/4', textColHeight: 'h-full' },
					medium: { ...commonClasses, mediaCol: 'md:w-1/3', textCol: 'md:w-2/3', textColHeight: 'h-full' },
					large: { ...commonClasses, mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', textColHeight: 'h-full' },
					default: { ...commonClasses, mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', textColHeight: 'h-full' },
				},
				withoutDescription: {
					default: { mediaCol: 'w-full' },
				},
				video: {
					small: { ...commonClasses, mediaCol: 'md:w-1/3', textCol: 'md:w-2/3', textColHeight: 'h-full' },
					medium: { ...commonClasses, mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', textColHeight: 'h-full' },
					large: { mediaCol: 'md:w-full', textCol: 'md:w-full', textColHeight: 'h-full' },
					default: { ...commonClasses, mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', textColHeight: 'h-full' },
				},
			},
		};

		if (region === 'Primary') {
			if (mediaDescription || mediaButtons) {
				return classes.Primary.withDescription[mediaSize] || classes.Primary.withDescription.default;
			}
			return classes.Primary.withoutDescription[mediaSize] || classes.Primary.withoutDescription.default;
		} else if (region === 'Secondary') {
			return { wrapperCol: 'w-full border-0 card mb-4' };
		} else {
			if (mediaDescription || mediaButtons) {
				return classes.NullRegion.withDescription[mediaSize] || classes.NullRegion.withDescription.default;
			}
			return classes.NullRegion.withoutDescription.default;
		}
	}

	function getVideoClasses(region, mediaSize) {
		const classes = {
			Primary: {
				small: { wrapperCol: 'md:w-1/3 border-0 card mb-4' },
				medium: { wrapperCol: 'w-full border-0 card mb-4' },
				large: { wrapperCol: 'w-full border-0 card mb-4' },
				default: { wrapperCol: 'sm:w-auto border-0 card mb-4' },
			},
			NullRegion: {
				small: { headingClass: 'mt-md-0', mediaCol: 'md:w-1/3', textCol: 'md:w-2/3', textColHeight: 'h-full' },
				medium: { headingClass: 'mt-md-0', mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', textColHeight: 'h-full' },
				large: { mediaCol: 'md:w-full', textCol: 'md:w-full', textColHeight: 'h-full' },
				default: { headingClass: 'mt-md-0', mediaCol: 'md:w-1/2', textCol: 'md:w-1/2', textColHeight: 'h-full' },
			},
		};

		if (region === 'Primary') {
			return classes.Primary[mediaSize] || classes.Primary.default;
		}
		return classes.NullRegion[mediaSize] || classes.NullRegion.default;
	}

	let computedClasses = {};

	if (region === 'Primary' || region === 'Secondary') {
		if (imageURL) {
			computedClasses = getMediaClasses(region, mediaSize, textColBg, mediaDescription, mediaButtons);
		} else if (videoURL) {
			computedClasses = getVideoClasses(region, mediaSize);
		}
	} else {
		computedClasses = getMediaClasses('NullRegion', mediaSize, textColBg, mediaDescription, mediaButtons);
		if (videoURL) {
			const videoClasses = getVideoClasses('NullRegion', mediaSize);
			computedClasses = { ...computedClasses, ...videoClasses };
		}
		if (textColBg) {
			mediaCol += ' ps-0';
		}
	}

	return {
		textColBg,
		headingClass,
		mediaCol,
		textCol,
		textColPadding,
		textColHeight,
		wrapperCol,
		leftDivClasses,
		rightDivClasses,
		headingColor,
		...computedClasses,
	};
}

export function buttonStyle(styleOfButton) {
	const styles = {
		Primary: 'red',
		'Primary (Outline)': 'red-outline',
		Secondary: 'white',
		'Secondary (Outline)': 'white-outline',
		Info: 'blue',
		'Info (Outline)': 'blue-outline',
		Success: 'green',
		'Success (Outline)': 'green-outline',
		Warning: 'yellow',
		'Warning (Outline)': 'yellow-outline',
		Danger: 'red',
		'Danger (Outline)': 'red-outline',
		Light: 'grey',
		'Light (Outline)': 'grey-outline',
		Dark: 'grey',
		'Dark (Outline)': 'grey-outline',
	};

	return styles[styleOfButton] || 'red';
}
