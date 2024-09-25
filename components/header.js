import PropTypes from "prop-types";

const Link = ({ title, url }) => {
  return <a href={url}>{title}</a>;
};

const Menu = ({ title, items }) => {
  return (
    <ul data-title={title}>
      {items.map((item, index) => (
        <li key={item?.title + index}>
          {Array.isArray(item?.items) ? (
            <Menu title={item.title} items={item.items} />
          ) : (
            <Link title={item.title} url={item.url}></Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export const Header = ({ topic, navigation, variant = "guelph" }) => {
  return (
    <uofg-header page-title={topic?.title} page-url={topic?.url} variant={variant}>
      {navigation?.map((item, index) => {
        if (Array.isArray(item.items)) {
          return <Menu key={item.title + index} title={item.title} items={item.items} />;
        }

        if (typeof item.url === "string" && typeof item.title === "string") {
          return <Link key={item.title + item.url + index} title={item.title} url={item.url}></Link>;
        }

        return null;
      })}
    </uofg-header>
  );
};

const link = PropTypes.shape({
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

const menu = PropTypes.shape({
  title: PropTypes.string.isRequired,
});
menu.items = PropTypes.arrayOf(PropTypes.oneOfType([link, menu])).isRequired;

Header.propTypes = {
  topic: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
  }),
  navigation: PropTypes.arrayOf(PropTypes.oneOfType([link, menu])),
  variant: PropTypes.oneOf(["guelph", "dual-brand", "ridgetown"]),
};
