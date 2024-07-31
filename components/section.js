import { createContext } from 'react';
import { twJoin } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const SectionContext = createContext(null);

export const Section = ({ primary, secondary, equal = false }) => (
	<div className={twJoin('grid w-full grid-cols-1', equal ? 'md:grid-cols-[50%_50%]' : 'md:grid-cols-[75%_25%]')}>
		<SectionContext.Provider value={{ column: 'primary', equal: equal }}>
			<div>{primary}</div>
		</SectionContext.Provider>
		<SectionContext.Provider value={{ column: 'secondary', equal: equal }}>
			<div>{secondary}</div>
		</SectionContext.Provider>
	</div>
);

Section.propTypes = {
	primary: PropTypes.node.isRequired,
	secondary: PropTypes.node.isRequired,
	equal: PropTypes.bool,
};
