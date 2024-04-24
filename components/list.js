import { twJoin, twMerge } from 'tailwind-merge';
import React from 'react';

const List = ({ variant = 'unordered', children, className, ...rest }) => {
	const Tag = variant === 'ordered' ? 'ol' : 'ul';
	const base = 'flex flex-col gap-1 my-2';
	const variants = {
		unordered: '',
		ordered: 'gap-2 [counter-reset:list-number]',
	};

	const item = 'h-fit w-full';
	const itemVariants = {
		unordered: 'before:content-["\\f054"] before:font-icon before:mr-[0.5em] before:text-yellow',
		ordered: 'before:inline-block before:[counter-increment:list-number] before:content-[counter(list-number)] before:mr-[0.5em] before:px-2 before:py-0.5 before:font-bold before:bg-yellow before:text-black before:px-1',
	};

	return (
		<Tag {...rest} className={twMerge(base, variants[variant] ?? variants['unordered'], className)}>
			{React.Children.toArray(children).map((child, index) => {
				return child?.type === 'li' ? (
					<li
						key={index}
						{...child?.props}
						className={twMerge(item, itemVariants[variant] ?? itemVariants['unordered'], child?.props?.className)}
					>
						{child?.props?.children}
					</li>
				) : (
					<li key={index} className={twJoin(item, itemVariants[variant] ?? itemVariants['unordered'])}>
						{child}
					</li>
				);
			})}
		</Tag>
	);
};

export default List;
