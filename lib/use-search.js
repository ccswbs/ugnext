import { useMemo } from "react";
import { editDistance, strncmp } from "../utils/string-utils.js";
import { stemmer } from "stemmer";

const parse = input =>
  input
    .toLowerCase()
    // Remove leading and trailing whitespace
    .trim()
    // Remove all non-alphabetic and non-whitespace characters
    .replace(/[^a-zA-Z\s]/g, "")
    // Split on whitespace and some common stop words
    .split(/\s+|\band\b|\bof\b|\bin\b/g)
    // Remove empty strings
    .filter(word => word.length > 0);

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
          if (tag.length - 1 < parsedWord.length && tag.endsWith("*") && parsedWord.startsWith(tag.slice(0, -1))) {
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

export function defaultSearchFunc(data) {
  const processed = data
    .map(node => {
      if (typeof node.title !== "string") {
        return null;
      }

      return {
        data: node,
        keywords: parse(node.title),
        tags: node.tags?.map(tag => (tag.includes(" ") ? tag.split(" ") : tag)) ?? [],
      };
    })
    .filter(Boolean);

  return input => {
    const parsed = parse(input);

    return processed
      ?.map(node => ({ ...node, rank: rank(node, parsed) }))
      ?.filter(node => node.rank > 0)
      ?.sort((a, b) => {
        if (a.rank > b.rank) return -1;
        if (a.rank < b.rank) return 1;

        return a?.title?.localeCompare(b?.title);
      })
      ?.map(node => node.data);
  };
}

export const useSearch = (data, input, searchFunc = defaultSearchFunc) => {
  if (!Array.isArray(data)) {
    throw new TypeError("data must be an array");
  }

  if (typeof searchFunc !== "function") {
    throw new TypeError(
      "searchFunc must be a curried function matching the signature: (data: any[]) => (input: string) => any[]",
    );
  }

  // Memoize the partial evaluation of the search function to avoid re-evaluating it on every render.
  const search = useMemo(() => searchFunc(data), [searchFunc, data]);

  return useMemo(() => {
    if (!input) return data;

    return search(input);
  }, [input, data, search]);
};
