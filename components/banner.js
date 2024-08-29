import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Banner = ({ color, className, children }) => {
	return (
		<div
			className={twMerge(
				'sticky w-full flex justify-center h-fit font-bold items-center top-0 left-0 p-3 text-lg z-50 overflow-x-hidden',
				color === 'red' && 'bg-red text-white',
				color === 'yellow' && 'bg-yellow text-black',
				color === 'blue' && 'bg-light-blue text-black',
				className,
			)}
		>
			{children}
		</div>
	);
};

Banner.propTypes = {
	color: PropTypes.oneOf(['red', 'yellow', 'blue']),
	children: PropTypes.node.isRequired,
};

export default Banner;
