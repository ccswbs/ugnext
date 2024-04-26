import { twJoin, twMerge } from 'tailwind-merge';
import React from 'react';

const List = ({ variant = 'unordered', children, className, ...rest }) => {
	const Tag = variant === 'ordered' ? 'ol' : 'ul';
	const classes = twJoin('my-2 flex flex-col gap-1', variant === 'ordered' && 'gap-2 [counter-reset:list-number]');
	const itemClasses = twJoin(
		'h-fit w-full',
		variant !== 'ordered' &&
			'relative pl-8 before:absolute before:left-[.5rem] before:top-[0.35rem] before:block before:h-[1.8rem] before:w-[1.1rem] before:shrink-0 before:items-center before:justify-center before:text-yellow before:content-[url("/icons/chevron-right.svg")]',
		variant === 'ordered' &&
			'relative pl-8 before:absolute before:left-0 before:inline-flex before:h-6 before:w-6 before:shrink-0 before:items-center before:justify-center before:bg-yellow before:font-black before:text-black before:content-[counter(list-number)] before:[counter-increment:list-number]',
	);

	return (
		<Tag {...rest} className={twMerge(classes, className)}>
			{React.Children.toArray(children).map((child, index) => {
				if (child?.type?.name === 'List') {
					return (
						<li key={index} className={twMerge(itemClasses, 'before:content-none')}>
							{child}
						</li>
					);
				}

				if (child?.type === 'li') {
					return (
						<li key={index} {...child?.props} className={twMerge(itemClasses, child?.props?.className)}>
							{child?.props?.children}
						</li>
					);
				}

				return (
					<li key={index} className={itemClasses}>
						{child}
					</li>
				);
			})}
		</Tag>
	);
};

export default List;
