import Image from "next/image";
import { twJoin, twMerge } from "tailwind-merge";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { Container } from "@/components/container";
import PropTypes from "prop-types";
import { EmbeddedVideo } from "@/components/embedded-video";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@awesome.me/kit-7993323d0c/icons/classic/solid";

export const Hero = ({ id, variant = "spotlight", image, video, title, caption, button, alignment }) => {
  return (
    <div className={twJoin("relative flex w-full flex-col overflow-hidden hero", variant !== "spotlight" && " h-fit")}>
      <Image
        className={twMerge(
          "aspect-[16/9] w-full object-cover md:aspect-[2.625]",
          variant === "spotlight" ? "max-h-[80vh] " : "max-h-[calc(85vh-14rem)]",
          image?.className
        )}
        src={image?.src}
        alt={image?.alt}
        width={image?.width}
        height={image?.height}
        priority
        placeholder={image?.blurred ? "blur" : "empty"}
        blurDataURL={image?.blurred}
      />

      {variant === "spotlight" && (
        <div className="flex items-center lg:container lg:absolute lg:bottom-0 lg:left-1/2 lg:max-w-max-content lg:-translate-x-1/2 lg:p-4">
          <div
            className={twJoin(
              "flex w-full bg-black p-7 text-white lg:bg-black/80 lg:backdrop-blur hero-caption-container",
              alignment !== "fullWidth" && "lg:max-w-[50%]",
              alignment === "center" && "mx-auto",
              alignment === "right" && "ml-auto"
            )}
          >
            <div
              className={twJoin(
                "container mx-auto flex flex-col gap-5",
                alignment === "center" && "lg:text-center",
                alignment === "right" && "lg:text-right"
              )}
            >
              {typeof title === "string" ? (
                <h2 className="font-condensed text-3xl font-bold">{title}</h2>
              ) : (
                <div className="font-condensed text-3xl font-bold">{title}</div>
              )}
              {caption && <span className="text-xl">{caption}</span>}
              {button && (
                <Button
                  id={id}
                  color="yellow"
                  href={button?.href}
                  className={twJoin(
                    "w-fit text-lg p-3 hover:bg-uog-color-red hover:text-white focus:bg-uog-color-red focus:text-white",
                    alignment === "center" && "lg:mx-auto",
                    alignment === "right" && "lg:ml-auto"
                  )}
                >
                  {button?.body}
                </Button>
              )}
              {video && (
                <EmbeddedVideo
                  src={video.src}
                  title={video.title}
                  transcript={video.transcript}
                  modal={{
                    button: (
                      <>
                        <FontAwesomeIcon icon={faPlay} />
                        <span>Watch Video</span>
                      </>
                    ),
                    type: "yellow",
                    className: "w-fit gap-2",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {variant !== "spotlight" && (
        <>
          <Container centered className="absolute bottom-0 left-1/2 h-fit w-full -translate-x-1/2 p-0">
            {typeof title === "string" ? (
              <Heading level={1} className="mb-0 w-fit bg-uog-color-yellow p-1 text-3xl text-black md:text-4xl">
                {title}
              </Heading>
            ) : (
              <div className="mb-0 w-fit bg-uog-color-yellow p-1 text-3xl text-black md:text-4xl">{title}</div>
            )}
          </Container>

          {video && (
            <EmbeddedVideo
              src={video.src}
              title={video.title}
              transcript={video.transcript}
              modal={{ type: "play-button", className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" }}
            />
          )}
        </>
      )}
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
  video: PropTypes.shape({
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    transcript: PropTypes.string,
  }),
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
