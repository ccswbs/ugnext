import { useEffect, useMemo, useState } from "react";

export const useMediaQuery = (query) => {
  const media = useMemo(() => {
    return typeof window === "undefined" ? null : window.matchMedia(query);
  }, [query]);
  const [matches, setMatches] = useState(media?.matches);

  useEffect(() => {
    const updateMatches = (e) => {
      setMatches(e.matches);
    };

    media?.addEventListener("change", updateMatches);

    return () => {
      media?.removeEventListener("change", updateMatches);
    };
  }, [media]);

  return matches;
};
