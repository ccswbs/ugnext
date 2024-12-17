import { useEffect, useState } from "react";

export const useHeaderHeight = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = document.querySelector("uofg-header")?.clientHeight ?? 0;
      setHeight(headerHeight);
    };

    updateHeight();

    window.addEventListener("resize", updateHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return height;
};
