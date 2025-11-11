export const toTitleCase = (str: string) => {
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
    return specialCases[str as keyof typeof specialCases];
  }

  return (
    str
      ?.toLowerCase()
      ?.split(/\s+|-|_+/)
      ?.map((word) => (lowercaseWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      ?.join(" ") ?? ""
  );
};

export const getHeadingLevel = (heading: string) => {
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
export const editDistance = (a: string, b: string) => {
  if (typeof a != "string" || typeof b != "string") return Infinity;

  let distances: number[][] = [];

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

export const strncmp = (a: string, b: string, upto = 0) => {
  if (typeof a != "string" || typeof b != "string") return false;

  for (let i = 0; i < upto; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

export function collapseSlashes(str: string) {
  if (typeof str !== "string") return str;

  // Preserve protocol (e.g., http://, https://, ftp://), then collapse remaining runs of slashes
  return str.replace(/(^[a-zA-Z][a-zA-Z\d+.-]*:)?\/{2,}/g, (m, proto) => (proto ? proto + "//" : "/"));
}
