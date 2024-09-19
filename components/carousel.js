import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { twJoin } from "tailwind-merge";
import { Children, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { bezier, lerp, mod, clamp } from "@/lib/math-utils";

const scroll = (element, to, duration) => {
  const from = element.scrollLeft;
  const start = performance.now();

  return new Promise((resolve) => {
    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const delta = bezier(Math.min(elapsed / duration, 1), 0.25, 0, 0.25, 1);

      element.scrollLeft = lerp(from, to, delta);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
};

export const Carousel = ({ children, display = 1, loop = "none" }) => {
  const count = Children.count(children);
  const visibleItems = Math.max(display, 1);
  const ref = useRef(null);
  const previousIndex = useRef(0);
  const [index, setIndex] = useState(0);
  const maxIndex = count - visibleItems;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const width = ref.current?.offsetWidth / visibleItems;

    if (loop === "jump" || loop === "none") {
      isAnimating.current = true;

      scroll(ref.current, width * index, 250).then(() => {
        isAnimating.current = false;
      });
    }

    if (loop === "continuous") {
      /*
      const column = mod(index + visibleItems, count);
      ref.current.scrollLeft = width * (column - 1);

      scroll(ref.current, width * column, 250).then(() => {
        isAnimating.current = false;
      });
       */
    }

    previousIndex.current = index;
  }, [index, loop, maxIndex, visibleItems]);

  const shift = (value) => {
    if (isAnimating.current) return;

    let idx;

    switch (loop) {
      case "none":
        idx = clamp(index + value, 0, maxIndex);
        break;
      case "jump":
        idx = mod(index + value, maxIndex + 1);
        break;
      case "continuous":
        idx = mod(index + value, count);
        break;
    }

    setIndex(idx);
  };

  return (
    <div className={twJoin("flex flex-col relative w-full min-h-[7rem] h-fit", count > visibleItems && "sm:px-16")}>
      {count > visibleItems && (
        <>
          <button
            onClick={() => shift(-1)}
            className={twJoin(
              "h-full w-16 items-center flex justify-center text-xl sm:text-6xl absolute text-yellow transition-[transform,color,opacity,visibility] hover:text-black focus-visible:text-black",
              "left-0 hover:-translate-x-1 focus-visible:-translate-x-1",
              loop === "none" && index === 0 && "opacity-0 invisible pointer-events-none"
            )}
            aria-label="Shift carousel left"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={() => shift(1)}
            className={twJoin(
              "h-full w-16 items-center flex justify-center text-xl sm:text-6xl absolute text-yellow transition-[transform,color,opacity,visibility] hover:text-black focus-visible:text-black",
              "right-0 hover:translate-x-1 focus-visible:translate-x-1",
              loop === "none" && index === maxIndex && "opacity-0 invisible pointer-events-none"
            )}
            aria-label="Shift carousel right"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}

      <div
        className="grid grid-cols-[repeat(var(--items),calc(100%/var(--display)))] w-full flex-1 overflow-x-hidden [&>*]:[grid-row:1]"
        style={{ "--display": visibleItems, "--items": count }}
        ref={ref}
      >
        {Children.map(children, (child, i) => (
          <div key={child.key}>{child}</div>
        ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  display: PropTypes.number,
  loop: PropTypes.oneOf(["jump", "continuous", "none"]),
};
