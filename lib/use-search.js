import { useMemo } from 'react';

export const useSearch = (data, input, searchFunc) => {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array');
  }

  if (typeof searchFunc !== 'function') {
    throw new TypeError(
      'searchFunc must be a curried function matching the signature: (data: any[]) => (input: string) => any[]',
    );
  }

  // Memoize the partial evaluation of the search function to avoid re-evaluating it on every render.
  const search = useMemo(() => searchFunc(data), [searchFunc, data]);

  return useMemo(() => {
    if (!input) return data;

    return search(input);
  }, [input, data, search]);
};
