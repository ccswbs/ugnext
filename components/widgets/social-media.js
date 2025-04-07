export const SocialMedia = ({ data }) => {
  console.log("Component props:", data);
  return (
    <div>
      <p>Test here</p>
      {data.map((link, index) => {
        const { name, url, value } = link;
        const fullLink = url + value;
        console.log("Rendering link:", fullLink);
        return (
          <div key={index}>
            <a href={fullLink}>{name}</a>
          </div>
        );
      })}
    </div>
  );
};

