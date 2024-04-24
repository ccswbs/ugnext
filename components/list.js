import { twMerge } from 'tailwind-merge';
import React from 'react';

const List = ({ variant = 'unordered', children, className, ...rest }) => {
	const Tag = variant === 'ordered' ? 'ol' : 'ul';
	const base = 'flex flex-col my-2 ml-[1.25em]';
	const variants = {
		unordered: 'list-disc',
		ordered: 'list-decimal',
	};

	return (
		<Tag {...rest} className={twMerge(base, variants[variant] ?? variants['unordered'], className)}>
			{React.Children.toArray(children).map((child, index) => {
				return child?.type === 'li' ? (
					<li key={index} {...child?.props} className={twMerge('h-fit w-full py-1.5', child?.props?.className)}>
						{child?.props?.children}
					</li>
				) : (
					<li key={index} className={'h-fit w-full py-1.5'}>
						{child}
					</li>
				);
			})}
		</Tag>
	);
};

export default List;
