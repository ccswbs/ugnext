import { twJoin } from "tailwind-merge";
import { Heading } from "@/components/heading";
import { getHeadingLevel } from "@/lib/string-utils";

export function SocialMediaWidget({ data }) {
  const links = data.socialMediaLinks || [];
  const title = data?.socialMediaTitle;
  const altText = data?.iconAltText;
  const level = getHeadingLevel(data.headingLevel);

  // Sort links alphabetically by name
  const sortedLinks = links.sort((a, b) => a.name.localeCompare(b.name));

  return sortedLinks.length > 0 ? (
    <>
      {title && <Heading level={level}>{title}</Heading>}
      <ul className="flex gap-2 list-none">
        {sortedLinks.map(({ name, url, value }, index) => (
          <li key={index}>
            <a
              href={url}
              aria-label={`${altText ? altText : value} on ${name}`}
              className={twJoin(
                "aspect-square bg-transparent focus:text-uog-color-white hover:text-uog-color-white size-11 text-4xl text-uog-color-black flex items-center justify-center",
                name === "Facebook" && "focus:bg-facebook-color-blue hover:bg-facebook-color-blue",
                name === "Instagram" && "focus:bg-instagram-color-pink hover:bg-instagram-color-pink",
                name === "LinkedIn" && "focus:bg-linkedin-color-blue hover:bg-linkedin-color-blue",
                name === "TikTok" && "focus:bg-uog-color-black hover:bg-uog-color-black",
                name === "X" && "focus:bg-uog-color-black hover:bg-uog-color-black",
                name === "Youtube" && "focus:bg-youtube-color-red hover:bg-youtube-color-red"
              )}
            >
              <i
                className={twJoin(
                  "fa-brands",
                  name === "Facebook" && "fa-facebook-f",
                  name === "Instagram" && "fa-instagram",
                  name === "LinkedIn" && "fa-linkedin-in",
                  name === "TikTok" && "fa-tiktok",
                  name === "X" && "fa-x-twitter",
                  name === "Youtube" && "fa-youtube"
                )}
              ></i>
            </a>
          </li>
        ))}
      </ul>
    </>
  ) : null;
};
