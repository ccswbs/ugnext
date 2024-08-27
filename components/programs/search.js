import { TextInput } from '@/components/text-input';
import { Select } from '@/components/select';
import { editDistance, strncmp, toTitleCase } from '@/lib/string-utils';
import { useSearch } from '@/lib/use-search';
import React, { useMemo, useState } from 'react';
import { ProgramNavigation } from '@/components/programs/navigation';
import { Card } from '@/components/card';
import { stemmer } from 'stemmer';

const programSearchFunc = (data) => {
	const parse = (input) => {
		return (
			input
				.toLowerCase()
				// Remove leading and trailing whitespace
				.trim()
				// Remove all non-alphabetic and non-whitespace characters
				.replace(/[^a-zA-Z\s]/g, '')
				// Split on whitespace and some common stop words
				.split(/\s+|\band\b|\bof\b|\bin\b/g)
				// Remove empty strings
				.filter((word) => word.length > 0)
		);
	};

	const rank = (node, parsed) => {
		const MATCH_TYPES = {
			EXACT: 10,
			CLOSE: 8,
			MATCHING_STEM: 6,
			MATCHES_WILDCARD: 5,
			STARTS_WITH: 4,
			NONE: 0,
		};

		const isMatch = (a, b) => {
			// Matches when A and B are the same. We test the length first to avoid the more expensive string comparison as it's not necessary if the lengths are different.
			if (a.length === b.length && a === b) {
				// We check how close A is to the B. This helps in situations where the user may have typed something like "biology", and we have two results "biology" and "animal biology". We want to rank "biology" higher than "animal biology" in this case as it's a closer match.
				return MATCH_TYPES.EXACT;
			}

			// Matches when A and B are within 2 characters of each other and have an edit distance of 2 or less (i.e. 2 or fewer changes). This is to account for typos and minor spelling mistakes. We test the length difference first to avoid the more expensive editDistance function as it's not necessary if the length difference is too large.
			if (Math.abs(a.length - b.length) < 2 && editDistance(a, b) < 2) {
				return MATCH_TYPES.CLOSE;
			}

			// Stemming (the process of finding the root of a word ex. computer -> comput) can help with matching words that are similar but not exactly the same. For example, "computer" and "computing" are related words, and we may want to match them. We use the Porter stemming algorithm to achieve this. Since stemming is an expensive operation, we only do it if the first 3 characters of A and B are the same, as words that don't match at least the first 3 characters will not have the same stem.
			if (strncmp(a, b, 3) && stemmer(a) === stemmer(b)) {
				return MATCH_TYPES.MATCHING_STEM;
			}

			// If A starts with B. This is to account for the user typing the beginning of a word.
			if (a.startsWith(b)) {
				return MATCH_TYPES.STARTS_WITH;
			}

			return MATCH_TYPES.NONE;
		};

		const matches = new Map();
		const updateMatches = (key, value) => {
			// We only keep the best match for each parsed word.

			if (value.type === MATCH_TYPES.NONE) return;

			const current = matches.get(key);
			// If the current match is a keyword, we only want to replace it with another keyword. If it's a tag, it can be replaced by a keyword or another tag.
			const isKeywordOrBothTags = value.isKeyword === true || value.isKeyword === Boolean(current?.isKeyword);

			if (value.type > (current?.type ?? 0) && isKeywordOrBothTags) {
				matches.set(key, value);
			}
		};

		for (let i = 0; i < parsed.length; i++) {
			const parsedWord = parsed[i];

			for (let j = 0; j < node.keywords.length; j++) {
				const keyword = node.keywords[j];
				const match = isMatch(keyword, parsedWord);

				updateMatches(parsedWord, {
					type: match,
					isKeyword: true,
					distance: Math.abs(i - j),
					word: keyword,
				});
			}

			for (let j = 0; j < node.tags.length; j++) {
				const tag = node.tags[j];

				if (Array.isArray(tag)) {
					let match = MATCH_TYPES.NONE;
					let index = NaN;

					// Check each subtag for a match.
					for (let k = 0; k < tag.length; k++) {
						match = isMatch(tag[k], parsedWord);

						if (match !== MATCH_TYPES.NONE) {
							index = k;
							break;
						}
					}

					// If we found a match, we need to check the index of the match, as we will need to check whether the previous parsedWord matched the previous subtag.
					if (match !== MATCH_TYPES.NONE) {
						if (index > 0) {
							const previousSubtag = tag[index - 1];
							const previousParsedWord = parsed[i - 1];

							if (matches.get(previousParsedWord)?.word !== previousSubtag) {
								match = MATCH_TYPES.NONE;
							}
						}
					}

					updateMatches(parsedWord, {
						type: match,
						isKeyword: false,
						word: tag[index],
					});
				} else {
					let match = isMatch(tag, parsedWord);

					if (match === MATCH_TYPES.NONE) {
						// Check wildcard matches
						if (tag.length - 1 < parsedWord.length && tag.endsWith('*') && parsedWord.startsWith(tag.slice(0, -1))) {
							match = MATCH_TYPES.MATCHES_WILDCARD;
						}
					}

					updateMatches(parsedWord, {
						type: match,
						isKeyword: false,
						word: tag,
					});
				}
			}
		}

		// If we didn't find a match for every parsed word, we return 0.
		if (matches.size !== parsed.length) {
			return 0;
		}

		// We calculate the rank by summing the type of each match. We give more weight to keyword matches than tag matches.
		return Array.from(matches.values()).reduce(
			(acc, match) => (match.isKeyword ? acc + match.type - Math.min(match.distance, 1) : acc + match.type / 2),
			0,
		);
	};

	const nodes = data
		.map((program) => ({
			data: program,
			keywords: parse(program.name),
			tags: program.tags?.map((tag) => (tag.includes(' ') ? tag.split(' ') : tag)) ?? [],
		}))
		.sort((a, b) => a?.name?.localeCompare(b?.name));

	return (input) => {
		const parsed = parse(input);

		return nodes
			?.map((node) => ({ ...node, rank: rank(node, parsed) }))
			?.filter((node) => node.rank > 0)
			?.sort((a, b) => {
				if (a.rank > b.rank) return -1;
				if (a.rank < b.rank) return 1;

				return a?.name?.localeCompare(b?.name);
			})
			?.map((node) => node.data);
	};
};

const enumerateProgramTypes = (programs) => {
	const types = new Map();

	for (const program of programs) {
		for (const type of program.types) {
			if (!types.has(type))
				types.set(type, {
					value: type,
					label: toTitleCase(type),
					selected: true,
				});
		}
	}

	return Array.from(types.values());
};

const ProgramCard = ({ program }) => (
	<Card
		key={program.name + program.url}
		href={program.url}
		title={<span className="flex items-center text-lg font-bold">{program.name}</span>}
		footer={
			<span className="overflow-hidden text-ellipsis whitespace-nowrap">
				{program?.types?.map((type) => toTitleCase(type)).join(', ')}
			</span>
		}
	/>
);

export const ProgramSearch = ({ programs, children, filterer, render }) => {
  const [input, setInput] = useState('');

	const types = useMemo(() => enumerateProgramTypes(programs), [programs]);
	const [selectedTypes, setSelectedTypes] = useState(types);

	const results = useSearch(programs, input, programSearchFunc);
	const filtered = useMemo(() => {
		let filtered = results?.filter((program) => selectedTypes.some((type) => program.types.includes(type.value)));

    if (typeof filterer === 'function') {
      filtered = filtered?.filter((program) => filterer(program));
    }

		return filtered;
	}, [filterer, results, selectedTypes]);

	return (
		<>
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="flex-1">
						<TextInput
							onInput={(value) => setInput(value)}
							label={<span className="text-xl font-bold">What would you like to study?</span>}
							placeholder="ex. programming, engineering, psychology, etc."
						/>
					</div>

					<div className="sm:w-1/3 md:w-1/4">
						<Select
							multiple
							options={types}
							onChange={(options) => {
								setSelectedTypes(options);
							}}
							label={<span className="text-xl font-bold">Filter by type</span>}
						/>
					</div>

          {children}
        </div>

				<ProgramNavigation />

				<div className="flex flex-col justify-between"></div>
			</div>

			{/* Search results */}
			<div className="mt-5 grid grid-cols-[repeat(auto-fit,_minmax(30rem,_1fr))] gap-5">
				{filtered?.map((program) =>
					typeof render === 'function' ? render(program) : <ProgramCard key={program.id} program={program} />,
				)}
			</div>

			{filtered?.length === 0 && (
				<div className="flex w-full items-center justify-center">
					<span className="text-xl font-bold text-black/50">No programs matching your criteria were found.</span>
				</div>
			)}
		</>
	);
};
