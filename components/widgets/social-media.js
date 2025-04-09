const Icon = ( {name} ) => {
  switch(name) {
    case "Facebook":
      return "fa-brands fa-facebook-f";
    case "Instagram":
      return "fa-brands fa-instagram";
    case "LinkedIn":
      return "fa-brands fa-linkedin-in";
    case "TikTok":
      return "fa-brands fa-tiktok";
    case "X":
      return "fa-brands fa-x-twitter";
    case "Youtube":
      return "fa-brands fa-youtube";
    default:
      return null;
  }
}


export const SocialMedia = ({ data }) => {
  const links = data.socialMediaLinks || [];  
  
// Sort links alphabetically by name
  const sortedLinks = links.sort((a, b) => a.name.localeCompare(b.name));

  return sortedLinks.length > 0 ? (
    <div>
      <ul className="flex flex-row gap-1 list-none">
        {sortedLinks.map(({ name, url }, index) => (
          <li key={index}>
            <a href={url} aria-label={name} className="hover:bg-uog-color-blue-focus hover:text-uog-color-blue-contrast px-2 text-4xl">
              <i className={Icon({ name })}></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

