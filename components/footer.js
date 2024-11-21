import PropTypes from "prop-types";
import { Container } from "@/components/container";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

export const Footer = ({ links, subFooter, variant = "guelph" }) => {
  useEffect(() => {
    import("@uoguelph/web-components/dist/uofg-web-components/uofg-footer.esm.js");
  }, []);

  return (
    <>
      {subFooter && (
        <div className="w-full bg-gray-100 py-5">
          <Container centered className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_3fr] p-5">
            <Image
              src={subFooter.image.src}
              height={subFooter.image.height}
              width={subFooter.image.width}
              alt={subFooter.image.alt}
              className={twMerge("w-full", subFooter.image.className)}
            />

            <div className="w-full">{subFooter.content}</div>
          </Container>
        </div>
      )}

      <uofg-footer variant={variant}>
        {Array.isArray(links) &&
          links?.map((link) => {
            return (
              <a key={link.url + link.title} href={link.url}>
                {link.title}
              </a>
            );
          })}
      </uofg-footer>
    </>
  );
};

Footer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  subFooter: PropTypes.shape({
    image: PropTypes.shape({
      src: PropTypes.string.isRequired,
      height: PropTypes.number,
      width: PropTypes.number,
      alt: PropTypes.string.isRequired,
      className: PropTypes.string,
      blurred: PropTypes.string,
    }).isRequired,
    content: PropTypes.node.isRequired,
  }),
  variant: PropTypes.oneOf(["guelph", "ridgetown"]),
};
