export const hierarchy = ['field-of-study', 'location', 'student-type'];

export class Requirement {
	constructor(val) {
		for (const attribute of hierarchy) {
			this[attribute] = val[attribute] || null;
		}

		this.data = {
			content: val?.content || '',
			title: val?.title || '',
		};
	}
	get slug() {
		let slug = 'undergraduate';

		for (let i = hierarchy.length - 1; i >= 0; i--) {
			const attribute = hierarchy[i];

			if (this[attribute]) {
				slug += `/${this[attribute]?.replaceAll('_', '-')}`;
			}
		}

		return slug;
	}
	get parents() {
		if (Array.isArray(this._parents)) {
			return this._parents;
		}

		this._parents = [];

		for (let i = 0; i < hierarchy.length; i++) {
			const attribute = hierarchy[i];
			const parent = Requirement.clone(this);

			if (this[attribute]) {
				for (let j = i; j >= 0; j--) {
					const removedAttribute = hierarchy[j];
					parent[removedAttribute] = null;
				}

				this.parents.push(parent);
			}
		}

		return this._parents;
	}
	permute() {
		// To permute all possible combinations of nullified attributes for this requirement,
		// we can treat the requirement as if it is a binary number.
		// where each bit indicates whether the corresponding attribute has been nullified or equal to its original value
		// with MSB being the most specific attribute in the hierarchy.

		// Equivalent to Math.pow(2, hierarchy.length)
		const n = 1 << hierarchy.length;
		const initMask = 1 << (hierarchy.length - 1);
		const permutations = [];

		for (let i = 0; i < n; i++) {
			const requirement = new Requirement({});

			for (let j = 0; j < hierarchy.length; j++) {
				const mask = initMask >> j;
				const attribute = hierarchy[j];
				requirement[attribute] = i & mask ? null : this[attribute];
			}

			permutations.push(requirement);
		}

		return permutations;
	}
	encode() {
		let encoded = 0;

		for (let i = 0; i < hierarchy.length; i++) {
			const attribute = hierarchy[i];
			const bit = this[attribute] ? 1 : 0;

			encoded |= bit << (hierarchy.length - 1 - i);
		}

		return encoded;
	}
	static parse(slug) {
		if (typeof slug === 'string') {
			slug = slug.split('/');
		}

		if (!Array.isArray(slug) || slug.length > hierarchy.length) {
			return null;
		}

		const parsed = {};

		for (let i = 0; i < hierarchy.length; i++) {
			const reverse = hierarchy.length - i - 1;
			parsed[hierarchy[reverse]] = slug[i] ?? null;
		}

		return new Requirement(parsed);
	}
	static clone(requirement) {
		const val = {};

		for (const key of hierarchy) {
			val[key] = requirement[key];
		}

		return new Requirement(val);
	}
	static equal(r1, r2) {
		for (const key of hierarchy) {
			if (r1[key] !== r2[key]) {
				return false;
			}
		}

		return true;
	}
	static distance(from, to) {
		if (!(from instanceof Requirement)) {
			throw new TypeError('from must be a Requirement object');
		}

		if (!(to instanceof Requirement)) {
			throw new TypeError('to must be a Requirement object');
		}

		if (Requirement.equal(from, to)) {
			return 0;
		}

		for (let i = 0; i < to.parents.length; i++) {
			const parent = to.parents[i];

			if (Requirement.equal(from, parent)) {
				return i;
			}
		}

		return Infinity;
	}
	static findClosest(needle, haystack) {
		const permutations = needle.permute();

		const relevant = haystack.filter((current) => {
			return permutations.some((p) => Requirement.equal(p, current));
		});

		let closest = null;
		let closestEncoding = 0;

		for (const requirement of relevant) {
			const encoding = requirement.encode();

			if (encoding >= closestEncoding) {
				closest = requirement;
				closestEncoding = encoding;
			}
		}

		return closest;
	}
}
