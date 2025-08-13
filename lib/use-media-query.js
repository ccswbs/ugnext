import { useEffect, useMemo, useState } from "react";

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const updateMatches = (e) => {
      setMatches(e.matches);
    };

    const media = window.matchMedia(query);
    setMatches(media.matches);

    media.addEventListener("change", updateMatches);

    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
};
