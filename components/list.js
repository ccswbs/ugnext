import { twJoin, twMerge } from 'tailwind-merge';
import React from 'react';

const List = ({ variant = 'unordered', children, className, ...rest }) => {
	const Tag = variant === 'ordered' ? 'ol' : 'ul';
	const classes = twJoin('flex flex-col gap-1 my-2', variant === 'ordered' && 'gap-2 [counter-reset:list-number]');
	const itemClasses = twJoin(
		'h-fit w-full',
		variant !== 'ordered' &&
			'flex before:font-black before:inline-flex before:shrink-0 before:items-center before:justify-center gap-2 before:w-6 before:h-6 before:text-yellow before:content-chevron-right before:font-icon',
		variant === 'ordered' &&
			'flex before:font-black before:inline-flex before:shrink-0 before:items-center before:justify-center before:[counter-increment:list-number] before:content-[counter(list-number)] gap-2 before:w-6 before:h-6 before:bg-yellow before:text-black',
	);

	return (
		<Tag {...rest} className={twMerge(classes, className)}>
			{React.Children.toArray(children).map((child, index) => {
				return child?.type === 'li' ? (
					<li key={index} {...child?.props} className={twMerge(itemClasses, child?.props?.className)}>
						{child?.props?.children}
					</li>
				) : (
					<li key={index} className={itemClasses}>
						{child}
					</li>
				);
			})}
		</Tag>
	);
};

export default List;
