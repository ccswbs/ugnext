import { getWords, StringSimilarity } from "@/lib/string-utils";

export class Term {
  readonly term: string;
  readonly weight: number;

  constructor(word: string, weight: number) {
    this.term = word;
    this.weight = Math.max(0, weight);
  }
}

export class TermDocument {
  readonly terms: Term[];
  readonly counts: Map<string, number>;

  constructor(terms: Term[]) {
    if (terms.length === 0) {
      throw new Error("A TermDocument can not be constructed with 0 terms.");
    }

    this.counts = new Map();

    // Terms will be sorted alphabetically by word, if they are the same word, we combine them into one.
    this.terms = terms
      .sort((a, b) => b.weight - a.weight)
      .map((term) => {
        const count = this.counts.get(term.term);

        if (count) {
          this.counts.set(term.term, count + 1);
          return null;
        } else {
          this.counts.set(term.term, 1);
          return term;
        }
      })
      .filter((term) => term !== null)
      .sort((a, b) => a.term.localeCompare(b.term));
  }

  getTermIndex(term: string): number {
    let left = 0;
    let right = this.terms.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = term.localeCompare(this.terms[mid].term);

      if (comparison === 0) {
        return mid; // Found the term
      } else if (comparison < 0) {
        right = mid - 1; // Search in the left half
      } else {
        left = mid + 1; // Search in the right half
      }
    }

    return -1; // Term not found
  }

  getTermWeight(term: string): number {
    const index = this.getTermIndex(term);
    return index === -1 ? 0 : this.terms[index].weight;
  }

  getTermCount(term: string) {
    return this.counts.get(term) ?? 0;
  }

  get total(): number {
    return this.terms.length;
  }

  getTermFrequency(term: string): number {
    return this.getTermCount(term) / this.total;
  }
}

export class TermDocumentCollection {
  readonly documents: TermDocument[];

  constructor(documents: TermDocument[]) {
    this.documents = documents;
  }

  getInverseDocumentFrequency(term: string): number {
    const occurrences = this.documents.reduce((acc, document) => {
      return acc + (document.getTermIndex(term) !== -1 ? 1 : 0);
    }, 0);

    if (occurrences === 0) return 0;

    return Math.log(this.documents.length / occurrences);
  }
}

// A function which returns a number from 0 to 1 indicating similarity (0 meaning not at all similar, and 1 being as similar as can be)
export type FuzzySearchCriteria = (a: string, b: string) => number;

export class FuzzySearch<T> {
  readonly data: T[];
  readonly collection: TermDocumentCollection;
  readonly criteria: FuzzySearchCriteria[];
  readonly criteriaWeights: Map<FuzzySearchCriteria, number> = new Map();
  readonly documentToDataMap: Map<TermDocument, T>;

  constructor(data: T[], parser: (data: T) => Term[], criteria: FuzzySearchCriteria[]) {
    const documents = data.map((value) => {
      const terms = parser(value);

      return new TermDocument(terms);
    });

    this.data = data;
    this.documentToDataMap = new Map();
    this.collection = new TermDocumentCollection(documents);
    this.criteria = [StringSimilarity.exact, ...criteria];
    this.criteriaWeights = new Map();

    for (let i = 0; i < this.criteria.length; i++) {
      this.criteriaWeights.set(this.criteria[i], 1 / (i + 1));
    }

    for (let i = 0; i < data.length; i++) {
      this.documentToDataMap.set(documents[i], data[i]);
    }
  }

  search(input: string, { useTfIdf = false }): T[] {
    if (input.length === 0) {
      return this.data;
    }

    const words = getWords(input) as string[];

    if (words.length === 0) {
      return this.data;
    }

    const matches = words.map((word) => {
      return this.collection.documents.reduce(
        (acc, document) => {
          const weight = document.terms
            .map((term) => {
              for (const criterion of this.criteria) {
                const similarity = criterion(word, term.term);

                if (similarity > 0) {
                  return (
                    similarity *
                    term.weight *
                    (this.criteriaWeights.get(criterion) ?? 0) *
                    (useTfIdf
                      ? document.getTermFrequency(term.term) * this.collection.getInverseDocumentFrequency(term.term)
                      : 1)
                  );
                }
              }

              return 0;
            })
            .reduce((acc, value) => acc + value, 0);

          if (weight > 0) {
            acc.push({ data: this.documentToDataMap.get(document) as T, weight });
          }

          return acc;
        },
        [] as { data: T; weight: number }[]
      );
    });

    const dataSet = new Set<T>();


    console.log(matches);

    return this.data;
  }
}
