import { useRef, useState } from "react";
import { UnstyledLink } from "@/components/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@awesome.me/kit-7993323d0c/icons/classic/solid";
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

export const LinkCarousel = ({ links }) => {
  const [activeLink, setActiveLink] = useState(links[0]);
  const previousActiveLink = useRef(null);

  const updateActiveLink = (link) => {
    setActiveLink((previous) => {
      previousActiveLink.current = previous;
      return link;
    });
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 z-0 h-full w-full">
        {links.map((link) => (
          <Image
            key={link.url}
            className={twMerge(
              "absolute left-0 top-0 hidden h-full object-cover object-left w-full",
              link === activeLink && "z-10 animate-fade md:block",
              link === previousActiveLink.current && "z-0 md:block",
              link.image?.className
            )}
            src={link.image.src}
            width={link.image?.width}
            height={link.image?.height}
            alt={link.image.alt}
            placeholder={link.image?.blurred ? "blur" : "empty"}
            blurDataURL={link.image?.blurred}
          />
        ))}
      </div>

      {activeLink?.caption && (
        <>
          <div className="absolute bottom-0 left-0 z-10 hidden w-full px-4 py-4 text-white md:block">
            {activeLink.caption}
          </div>

          <div className="absolute bottom-0 left-0 z-0 hidden h-1/2 w-full bg-gradient-to-t from-black/60 to-black/0 md:block"></div>
        </>
      )}

      <div className="relative z-10 ml-auto flex w-full flex-col gap-2 md:w-1/3">
        {links.map((link, index) => (
          <UnstyledLink
            onMouseEnter={() => {
              updateActiveLink(link);
            }}
            onFocus={() => {
              updateActiveLink(link);
            }}
            key={index}
            href={link.url}
            className="flex flex-1 items-center justify-between bg-black/60 p-7 text-[2.2rem] text-white backdrop-blur transition-colors hover:bg-yellow hover:text-black focus:bg-yellow focus:text-black focus-visible:outline-none"
          >
            <span>{link.title}</span>

            <FontAwesomeIcon className="h-[1em]" icon={faChevronRight} />
          </UnstyledLink>
        ))}
      </div>
    </div>
  );
};

LinkCarousel.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        height: PropTypes.number,
        width: PropTypes.number,
        alt: PropTypes.string.isRequired,
        className: PropTypes.string,
        blurred: PropTypes.string,
      }).isRequired,
      caption: PropTypes.string,
    })
  ).isRequired,
};
