import { useEffect, useState } from "react";

export const useDismissible = (id, hash, container = "local") => {
  const key = `${id}-use-dismissible-hash`;
  const storage =
    typeof window === "object" ? (container === "session" ? window.sessionStorage : window.localStorage) : null;

  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) {
        return;
      }

      setDismissed(storage.getItem(key) === hash);
    };

    const oldHash = storage.getItem(key);
    setDismissed(oldHash === hash);

    if (oldHash && oldHash !== hash) {
      storage.removeItem(key);
    }

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [hash, key, storage]);

  return {
    dismissed,
    dismiss: () => {
      setDismissed(true);
      storage.setItem(key, hash);
    },
  };
};
