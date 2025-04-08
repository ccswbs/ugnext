export const SocialMedia = ({ data }) => {
  const links = data.socialMediaLinks || [];

  return links.length > 0 ? (
    <div>
      <h2>Visit Us on Social Media</h2>
      <ul>
        {links.map(({ name, url }, index) => (
          <li key={index}>
            <a href={url}>{name}</a>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

