export const getHeadingLevel = (heading) => {
	if (typeof heading !== 'string') {
		return null;
	}

	const matches = heading?.match(/\d+/);
	if (matches) {
		return Number(matches[0]);
	}

	return null;
};
