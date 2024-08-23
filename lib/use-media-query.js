import { useEffect, useMemo, useState } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  const media = useMemo(() => {
    return typeof window === 'undefined' ? null : window.matchMedia(query);
  }, [query]);

  useEffect(() => {
    const updateMatches = (e) => {
      setMatches(e.matches);
    };

    media?.addEventListener('change', updateMatches);

    return () => {
      media?.removeEventListener('change', updateMatches);
    };
  }, [media]);

  return matches;
};
