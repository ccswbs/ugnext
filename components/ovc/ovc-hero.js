import Image from "next/image";
import { twJoin, twMerge } from "tailwind-merge";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { Container } from "@/components/container";
import PropTypes from "prop-types";


export const Hero = ({ image, title, caption}) => {
  return (
    <div className={"relative flex w-full flex-col overflow-hidden"}>
      <Image
        className={twMerge("aspect-[16/9] w-full object-cover md:aspect-[2.625]",
          image?.className
        )}
        src={image?.src}
        alt={image?.alt}
        width={image?.width}
        height={image?.height}
        priority
        sizes="100vw"
        placeholder={image?.blurred ? "blur" : "empty"}
        blurDataURL={image?.blurred}
      />

     
        <Container centered className="absolute bottom-0 left-1/2 h-fit w-full -translate-x-1/2 p-0">
            <Heading level={1} className="mb-0 w-fit p-1 text-3xl text-yellow md:text-4xl">
              {title}
            </Heading>
            <p>A world leader in advancing veterinary science, learning and research to improve the lives of animals, people and our planet</p>
        </Container>

    </div>
  );
};

Hero.propTypes = {
  variant: PropTypes.oneOf(["spotlight", "content-hub"]),
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    blurred: PropTypes.string,
  }).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  /**
   * A short paragraph to display underneath the title (does nothing for content-hub variant)
   */
  caption: PropTypes.string,
  /**
   * Determines the position of the title, caption and button within the hero (does nothing for content-hub variant)
   */
  alignment: PropTypes.oneOf(["left", "center", "right", "fullWidth"]),
  /**
   * A button link to display underneath the caption/title (does nothing for content-hub variant)
   */
  button: PropTypes.shape({
    href: PropTypes.string,
    body: PropTypes.string,
  }),
};