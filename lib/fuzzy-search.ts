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

  constructor(terms: Term[]) {
    if (terms.length === 0) {
      throw new Error("A TermDocument can not be constructed with 0 terms.");
    }

    // Terms will be sorted alphabetically by word, if they are the same word, then the one with a higher weight will appear first.
    this.terms = terms.sort((a, b) => {
      const cmp = a.term.localeCompare(b.term);

      if (cmp === 0) {
        return b.weight - a.weight;
      }

      return cmp;
    });
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

  getTerm(term: string): Term | void {
    // Due to how terms are sorted, if a term appears in the array multiple times, the one with a higher weight will be returned.
    const index = this.getTermIndex(term);
    return index === -1 ? undefined : this.terms[index];
  }

  getTermCount(term: string) {
    let count = 0;
    let index = this.getTermIndex(term);

    while (this.terms[index]?.term === term) {
      count++;
      index++;
    }

    return count;
  }

  get total(): number {
    return this.terms.length;
  }

  getTermFrequency(term: string): number {
    return this.getTermCount(term) / this.total;
  }

  /*
  fuzzySearch(word: string, criteria: FuzzySearchCriteria[]): TermFuzzyMatch[] {
    return this.terms.reduce((acc, keyword) => {
      for (const criterion of criteria) {
        const similarity = criterion.calculateSimilarity(keyword.word, word);

        if (similarity > 0) {
          acc.push({
            word: keyword.word,
            weight: keyword.weight + criterion.weight * similarity,
          });

          // If a keyword has matched against a criterion, then we don't need to check the other criteria.
          break;
        }
      }

      return acc;
    }, [] as TermFuzzyMatch[]);
  }*/
}

export class TermDocumentCollection {
  readonly documents: TermDocument[];

  constructor(documents: TermDocument[]) {
    this.documents = documents;
  }

  getInverseDocumentFrequency(term: string): number {
    const occurrences = this.documents.reduce((acc, document) => {
      return acc + (document.getTerm(term) ? 1 : 0);
    }, 0);

    return Math.log((1 + this.documents.length) / (1 + occurrences));
  }

  /*
  fuzzySearch(word: string, criteria: FuzzySearchCriteria[], useTdIdf = false): TermDocumentFuzzyMatch[] {


    return this.documents.reduce((acc, document) => {
      let matches = document.fuzzySearch(word, criteria);

      if (matches.length === 0) {
        return acc;
      }

      if (useTdIdf) {
        matches = matches.map((match) => {
          return {
            ...match,
            weight:
              match.weight * (document.getTermFrequency(match.word) * this.getInverseDocumentFrequency(match.word)),
          } as TermFuzzyMatch;
        });
      }

      return acc.concat({
        document: document,
        weight: matches.reduce((acc, match) => acc + match.weight, 0),
      });
    }, [] as TermDocumentFuzzyMatch[]);
  }*/
}

// A function which returns a number from 0 to 1 indicating similarity (0 meaning not at all similar, and 1 being as similar as can be)
export type FuzzySearchCriteria = (a: string, b: string) => number;

export class FuzzySearch<T> {
  readonly data: T[];
  readonly collection: TermDocumentCollection;
  readonly criteria: FuzzySearchCriteria[];
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

    for (let i = 0; i < data.length; i++) {
      this.documentToDataMap.set(documents[i], data[i]);
    }
  }

  private getCriteriaWeight(criteria: FuzzySearchCriteria): number {
    const index = this.criteria.indexOf(criteria);

    if(index === -1) {
      return 0;
    }

    return 1 / (index + 1);
  }

  search(input: string): T[] {
    if (input.length === 0) {
      return this.data;
    }

    const words = getWords(input);

    if (words.length === 0) {
      return this.data;
    }

    return this.data;
  }
}
