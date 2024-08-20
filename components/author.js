import { twJoin } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Author = ({ name, info, color = 'red' }) => (
  <div
    className={twJoin(
      'flex flex-col gap-2 border-l-4 pl-4',
      color === 'yellow' && 'border-l-yellow',
      color === 'red' && 'border-l-red',
    )}
  >
    <span className={twJoin('font-bold')}>{name}</span>
    <span className="italic">{info}</span>
  </div>
);

Author.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  color: PropTypes.oneOf(['red', 'yellow']),
};
