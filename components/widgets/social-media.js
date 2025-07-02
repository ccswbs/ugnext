import { twJoin } from "tailwind-merge";
import { Typography } from "@uoguelph/react-components/typography";

export function SocialMediaWidget({ data }) {
  const links = data.socialMediaLinks || [];
  const title = data?.socialMediaTitle;
  const altText = data?.iconAltText;
  const level = data.headingLevel;

  // Sort links alphabetically by name
  const sortedLinks = links.sort((a, b) => a.name.localeCompare(b.name));

  return sortedLinks.length > 0 ? (
    <>
      {title && <Typography type={level} as={level}>{title}</Typography>}
      <ul className="flex gap-2 list-none">
        {sortedLinks.map(({ name, url, value }, index) => (
          <li key={index}>
            <a
              href={url}
              aria-label={`${altText ? altText : value} on ${name}`}
              className={twJoin(
                "aspect-square bg-transparent focus:text-white hover:text-white size-11 text-4xl text-black flex items-center justify-center",
                name === "Facebook" && "focus:bg-facebook-blue hover:bg-facebook-blue",
                name === "Instagram" && "focus:bg-instagram-pink hover:bg-instagram-pink",
                name === "LinkedIn" && "focus:bg-linkedin-blue hover:bg-linkedin-blue",
                name === "TikTok" && "focus:bg-black hover:bg-black",
                name === "X" && "focus:bg-black hover:bg-black",
                name === "Youtube" && "focus:bg-youtube-red hover:bg-youtube-red"
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
