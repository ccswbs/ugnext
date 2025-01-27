import { stemmer } from "stemmer";

export const toTitleCase = (str) => {
  const lowercaseWords = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "on",
    "at",
    "to",
    "by",
    "of",
    "in",
    "with",
  ];

  const specialCases = {
    "co-op": "Co-op",
    "thesis-based": "Thesis-based",
    "course-based": "Course-based",
  };

  if (str in specialCases) {
    return specialCases[str];
  }

  return (
    str
      ?.toLowerCase()
      ?.split(/\s+|-|_+/)
      ?.map((word) => (lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      ?.join(" ") ?? ""
  );
};

export const getHeadingLevel = (heading) => {
  if (typeof heading !== "string") {
    return null;
  }

  const matches = heading?.match(/\d+/);
  if (matches) {
    return Number(matches[0]);
  }

  return null;
};

// A function to compute the Levenshtein distance of two strings (useful for fuzzy string matching)
export const editDistance = (a, b) => {
  if (typeof a != "string" || typeof b != "string") return Infinity;

  let distances = [];

  for (let i = 0; i <= a.length; i++) {
    distances[i] = [];

    for (let j = 0; j <= b.length; j++) {
      if (Math.min(i, j) === 0) {
        distances[i][j] = Math.max(i, j);
      } else {
        if (a.charAt(i - 1) !== b.charAt(j - 1)) {
          distances[i][j] = Math.min(distances[i - 1][j] + 1, distances[i][j - 1] + 1, distances[i - 1][j - 1] + 1);
        } else {
          distances[i][j] = Math.min(distances[i - 1][j] + 1, distances[i][j - 1] + 1, distances[i - 1][j - 1]);
        }
      }
    }
  }

  return distances[a.length][b.length];
};

export const strncmp = (a, b, upto = 0) => {
  if (typeof a != "string" || typeof b != "string") return false;

  for (let i = 0; i < upto; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

export const getWords = (str) => {
  return (
    str
      .toLowerCase()
      // Remove leading and trailing whitespace
      .trim()
      // Remove all non-alphabetic and non-whitespace characters
      .replace(/[^a-zA-Z\s]/g, "")
      // Split on whitespace
      .split(/\s+/g)
      // Remove empty strings
      .filter((word) => word.length > 0)
  );
};

export class StringSimilarity {
  static exact(a, b) {
    return a === b ? 1 : 0;
  }

  static bidirectionalSubstring(a, b) {
    const distance = a.length > b.length ? a.indexOf(b) : b.indexOf(a);

    if (distance === -1) return 0;

    // Adjust the score based on the length of the substring and where it was found
    return (1 - distance / a.length) * (b.length / a.length);
  }

  static stemmer(a, b) {
    const matches = strncmp(a, b, 3) && stemmer(a) === stemmer(b);
    return matches ? 1 : 0;
  }

  static levenshtein(a, b, maxDistance = 2) {
    const distance = Math.min(editDistance(a, b), maxDistance);

    if (distance === 0) return 1;

    // If the edit distance is equal to the length of the largest string,
    // then that means the string is completely different
    if (distance === Math.max(a.length, b.length)) return 0;

    return 1 - distance / maxDistance;
  }

  static startsWith(a, b) {
    return a.startsWith(b) ? 1 : 0;
  }
}
