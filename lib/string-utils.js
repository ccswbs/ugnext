export const toTitleCase = (str) => {
	const lowercaseWords = [
		'a',
		'an',
		'the',
		'and',
		'but',
		'or',
		'for',
		'nor',
		'on',
		'at',
		'to',
		'by',
		'of',
		'in',
		'with',
	];

	const specialCases = {
		'co-op': 'Co-op',
	};

	if (str in specialCases) {
		return specialCases[str];
	}

	return (
		str
			?.toLowerCase()
			?.split(/\s+|-|_+/)
			?.map((word) => (lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
			?.join(' ') ?? ''
	);
};